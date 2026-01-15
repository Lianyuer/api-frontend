import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, Drawer, message, Popconfirm } from 'antd';
import type { SortOrder } from 'antd/lib/table/interface';
import React, { useCallback, useRef, useState } from 'react';
import { removeRule } from '@/services/ant-design-pro/api';
import {
  deleteInterfaceInfoUsingPost,
  listInterfaceInfoVoByPageUsingPost,
} from '@/services/api-backend/interfaceInfoController';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const [messageApi, contextHolder] = message.useMessage();
  const { run: delRun, loading } = useRequest(removeRule, {
    manual: true,
    onSuccess: () => {
      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();
      messageApi.success('Deleted successfully and will refresh soon');
    },
    onError: () => {
      messageApi.error('Delete failed, please try again');
    },
  });
  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      search: false,
      hideInTable: true,
    },
    {
      title: '接口名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '地址',
      dataIndex: 'url',
    },
    {
      title: '请求类型',
      dataIndex: 'method',
      valueEnum: {
        GET: {
          text: 'GET',
        },
        POST: {
          text: 'POST',
        },
        PUT: {
          text: 'PUT',
        },
        DELETE: {
          text: 'DELETE',
        },
        FETCH: {
          text: 'FETCH',
        },
      },
    },
    {
      title: '请求头',
      dataIndex: 'requestHeader',
      search: false,
    },
    {
      title: '响应头',
      dataIndex: 'responseHeader',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Error',
        },
        1: {
          text: '开启',
          status: 'Success',
        },
      },
    },
    {
      title: '创建人',
      render: (_, record) => [
        <span key={record.userVO.id}>
          {record?.userVO.userName
            ? record?.userVO.userName
            : record?.userVO.id}
        </span>,
      ],
      search: false,
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <UpdateForm
          key="update"
          reload={actionRef.current?.reload}
          values={record}
        />,
        <Popconfirm
          title="确认删除该接口吗？"
          description=""
          onConfirm={async () => {
            const res = await deleteInterfaceInfoUsingPost({ id: record.id });
            if (res.code === 0) {
              message.success('操作成功');
              actionRef.current?.reload();
            } else {
              message.error(res.message);
            }
          }}
          onCancel={() => {}}
          okText="确认"
          cancelText="取消"
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = useCallback(
    async (selectedRows: API.RuleListItem[]) => {
      if (!selectedRows?.length) {
        messageApi.warning('请选择删除项');
        return;
      }
      await delRun({
        data: {
          key: selectedRows.map((row) => row.id),
        },
      });
    },
    [delRun, messageApi.warning],
  );
  return (
    <PageContainer>
      {contextHolder}
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <CreateForm key="create" reload={actionRef.current?.reload} />,
        ]}
        request={async (
          params,
          _sort: Record<string, SortOrder>,
          _filter: Record<string, (string | number)[] | null>,
        ) => {
          const res = await listInterfaceInfoVoByPageUsingPost({ ...params });
          if (res.data) {
            return {
              data: res.data.records || [],
              success: true,
              total: res.total,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
              <span>
                服务调用次数总计{' '}
                {selectedRowsState.reduce(
                  (pre, item) => pre + (item.callNo ?? 0),
                  0,
                )}{' '}
                万
              </span>
            </div>
          }
        >
          <Button
            loading={loading}
            onClick={() => {
              handleRemove(selectedRowsState);
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};
export default TableList;
