import {
  type ActionType,
  type ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import type { SortOrder } from 'antd/lib/table/interface';
import React, { useRef } from 'react';
import { getAccessKeyByUserIdUsingGet } from '@/services/api-backend/userController';

const AccessKey: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: 'accessKey',
      dataIndex: 'accessKey',
      search: false,
    },
    {
      title: 'secretKey',
      dataIndex: 'secretKey',
      search: false,
    },
  ];

  return (
    <>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={'查询accessKey'}
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        search={false}
        pagination={{ pageSize: 10 } as any}
        request={async (
          params,
          sort: Record<string, SortOrder>, // 修改参数名从 _sort 为 sort
          _filter: Record<string, (string | number)[] | null>,
        ) => {
          // // 构建排序字段
          // let sortField = 'createTime';
          // let sortOrder = 'desc';
          //
          // // 如果有排序参数，解析排序字段和顺序
          // if (Object.keys(sort).length > 0) {
          //   const sortKey = Object.keys(sort)[0];
          //   sortField = sortKey;
          //   sortOrder = sort[sortKey] === 'ascend' ? 'asc' : 'desc';
          // }

          const res = await getAccessKeyByUserIdUsingGet();
          if (res.data) {
            return {
              data: [res.data],
              success: true,
            };
          }
        }}
        columns={columns}
      />
    </>
  );
};

export default AccessKey;
