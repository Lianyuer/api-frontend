import { InterfaceInfoStatusEnum } from "@/enums/InterfaceInfoStatusEnum";
import {
  deleteInterfaceInfoUsingPost,
  listInterfaceInfoVoByPageUsingPost,
  offlineInterfaceInfoUsingPost,
  onlineInterfaceInfoUsingPost,
} from "@/services/api-backend/interfaceInfoController";
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from "@ant-design/pro-components";
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from "@ant-design/pro-components";
import { App, Button, Drawer, Popconfirm, Typography } from "antd";
import type { SortOrder } from "antd/lib/table/interface";
import React, { useRef, useState } from "react";
import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";

const { Link } = Typography;

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const { message } = App.useApp();
  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: "id",
      dataIndex: "id",
      search: false,
      hideInTable: true,
    },
    {
      title: "接口名称",
      dataIndex: "name",
    },
    {
      title: "描述",
      dataIndex: "description",
      valueType: "textarea",
      search: false,
    },
    {
      title: "地址",
      dataIndex: "url",
    },
    {
      title: "请求类型",
      dataIndex: "method",
      valueEnum: {
        GET: {
          text: "GET",
        },
        POST: {
          text: "POST",
        },
        PUT: {
          text: "PUT",
        },
        DELETE: {
          text: "DELETE",
        },
        FETCH: {
          text: "FETCH",
        },
      },
    },
    {
      title: "请求头",
      dataIndex: "requestHeader",
      search: false,
    },
    {
      title: "响应头",
      dataIndex: "responseHeader",
      search: false,
    },
    {
      title: "状态",
      dataIndex: "status",
      hideInForm: true,
      valueEnum: {
        0: {
          text: "关闭",
          status: "Error",
        },
        1: {
          text: "开启",
          status: "Success",
        },
      },
    },
    {
      title: "创建人",
      render: (_, record) => [
        <span key={`user-${record.id}`}>
          {record?.userVO.userName
            ? record?.userVO.userName
            : record?.userVO.id}
        </span>,
      ],
      search: false,
    },
    {
      title: "创建时间",
      sorter: true,
      dataIndex: "createTime",
      valueType: "dateTime",
      search: false,
    },
    {
      title: "更新时间",
      sorter: true,
      dataIndex: "updateTime",
      valueType: "dateTime",
      search: false,
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      render: (_, record) => [
        <UpdateForm
          key="update"
          reload={actionRef.current?.reload}
          values={record}
        />,
        // 直接使用三元表达式，不加额外的大括号
        record.status === InterfaceInfoStatusEnum.OFFLINE ? (
          <Link
            key="online" // 必须添加 key
            onClick={async () => {
              const res = await onlineInterfaceInfoUsingPost({ id: record.id });
              if (res.code === 0) {
                message.success("操作成功");
                actionRef.current?.reload();
              } else {
                message.error(res.message);
              }
            }}
          >
            发布
          </Link>
        ) : (
          <Popconfirm
            key="offline" // 必须添加 key
            title="确认下线该接口吗？"
            description=""
            onConfirm={async () => {
              const res = await offlineInterfaceInfoUsingPost({
                id: record.id,
              });
              if (res.code === 0) {
                message.success("操作成功");
                actionRef.current?.reload();
              } else {
                message.error(res.message);
              }
            }}
            onCancel={() => {}}
            okText="确认"
            cancelText="取消"
          >
            <a>下线</a>
          </Popconfirm>
        ),
        <Popconfirm
          key="delete"
          title="确认删除该接口吗？"
          description=""
          onConfirm={async () => {
            const res = await deleteInterfaceInfoUsingPost({ id: record.id });
            if (res.code === 0) {
              message.success("操作成功");
              actionRef.current?.reload();
            } else {
              message.error(res.message);
            }
          }}
          onCancel={() => {}}
          okText="确认"
          cancelText="取消"
        >
          <a key="rowDel" style={{ color: "red" }}>
            删除
          </a>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={"查询表格"}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <CreateForm key="create" actionRef={actionRef} />,
        ]}
        pagination={{ pageSize: 10 }}
        request={async (
          params,
          sort: Record<string, SortOrder>, // 修改参数名从 _sort 为 sort
          _filter: Record<string, (string | number)[] | null>
        ) => {
          // 构建排序字段
          let sortField = "createTime";
          let sortOrder = "desc";

          // 如果有排序参数，解析排序字段和顺序
          if (Object.keys(sort).length > 0) {
            const sortKey = Object.keys(sort)[0];
            sortField = sortKey;
            sortOrder = sort[sortKey] === "ascend" ? "asc" : "desc";
          }

          const res = await listInterfaceInfoVoByPageUsingPost({
            ...params,
            sortField, // 排序字段
            sortOrder, // 排序方式
          });
          if (res.data) {
            return {
              data: res.data.records || [],
              success: true,
              total: res.data.total,
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
              已选择{" "}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{" "}
              项 &nbsp;&nbsp;
              <span>
                服务调用次数总计{" "}
                {selectedRowsState.reduce(
                  (pre, item) => pre + (item.callNo ?? 0),
                  0
                )}{" "}
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
