import { PageContainer } from '@ant-design/pro-components';
import { Badge, Card, Descriptions, message } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useMatch, useParams } from 'react-router';
import { getInterfaceInfoVoByIdUsingGet } from '@/services/api-backend/interfaceInfoController';

/**
 * 主页
 * @constructor
 */

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>();
  // 使用useMatch钩子将当前URL与指定的路径模式/interface_info/:id进行匹配，
  // 并将匹配结果赋值给match变量
  const match = useMatch('/interfaceInfo/:id');
  const params = useParams();

  const loadData = async (current = 1, pageSize = 5) => {
    // 检查动态路由参数是否存在
    if (!params?.id) {
      message.error('参数不存在');
      return;
    }
    setLoading(true);
    try {
      const res = await getInterfaceInfoVoByIdUsingGet({ id: params.id });
      setData(res.data);
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <PageContainer title="查看接口文档">
      <Card>
        {data ? (
          <Descriptions title={data?.name} column={1}>
            <Descriptions.Item label="接口状态">
              {data?.status ? (
                <>
                  <Badge status="success" />
                  &nbsp;开启
                </>
              ) : (
                <>
                  <Badge status="error" />
                  &nbsp;关闭
                </>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="描述">
              {data?.description}
            </Descriptions.Item>
            <Descriptions.Item label="请求地址">{data?.url}</Descriptions.Item>
            <Descriptions.Item label="请求类型">
              {data?.method}
            </Descriptions.Item>
            <Descriptions.Item label="请求头">
              {data?.requestHeader}
            </Descriptions.Item>
            <Descriptions.Item label="响应头">
              {data?.responseHeader}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {dayjs(data?.createTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {dayjs(data?.updateTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <>接口不存在</>
        )}
      </Card>
    </PageContainer>
  );
};

export default Index;
