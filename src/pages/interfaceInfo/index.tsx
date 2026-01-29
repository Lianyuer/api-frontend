import { PageContainer } from '@ant-design/pro-components';
import {
  Badge,
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  message,
  Typography,
} from 'antd';
import type { FormProps } from 'antd/lib';
import dayjs from 'dayjs';
import { res } from 'pino-std-serializers';
import React, { useEffect, useState } from 'react';
import { useMatch, useParams } from 'react-router';
import {
  getInterfaceInfoVoByIdUsingGet,
  invokeInterfaceInfoUsingPost,
} from '@/services/api-backend/interfaceInfoController';

const { Text } = Typography;

/**
 * 主页
 * @constructor
 */

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [invokeRes, setInvokeRes] = useState();
  const [invokeLoading, setInvokeLoading] = useState(false);
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

  const apiData = {
    requestParams: data?.requestParams,
    requestHeader: data?.requestHeader,
    responseHeader: data?.responseHeader,
    invokeRes: JSON.stringify(invokeRes),
  };

  type FieldType = {
    requestParams?: string;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    if (!params?.id) {
      message.error('接口不存在');
      return;
    }
    try {
      setInvokeLoading(true);
      const res = await invokeInterfaceInfoUsingPost({
        id: params.id,
        ...values,
      } as API.InterfaceInfoInvokeRequest);
      if (res.code === 0) {
        message.success('请求成功');
        setInvokeRes(res);
      } else {
        message.error('调用失败，请检查输入');
      }
    } catch (e) {
      message.error('操作失败，' + e.message);
    } finally {
      setInvokeLoading(false);
    }
  };

  const JsonDisplayItem = ({ data, field, label }) => {
    const formatJson = (jsonString) => {
      if (!jsonString || jsonString.trim() === '') {
        return { isValid: false, content: '无' };
      }

      try {
        // 尝试解析JSON
        const parsed = JSON.parse(jsonString);
        const formatted = JSON.stringify(parsed, null, 2);
        return { isValid: true, content: formatted };
      } catch (error) {
        // 如果解析失败，可能是字符串而不是JSON数组
        try {
          // 尝试解析为数组字符串
          if (jsonString.startsWith('[') && jsonString.endsWith(']')) {
            const parsed = JSON.parse(jsonString);
            const formatted = JSON.stringify(parsed, null, 2);
            return { isValid: true, content: formatted };
          }
          // 如果不是JSON格式，直接返回原字符串
          return { isValid: false, content: jsonString };
        } catch (e) {
          return { isValid: false, content: jsonString };
        }
      }
    };

    const result = formatJson(data?.[field]);

    return (
      <Descriptions.Item label={label} span={3}>
        {result.isValid ? (
          <div
            style={{
              backgroundColor: '#fafafa',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #d9d9d9',
              maxHeight: '300px',
              overflow: 'auto',
              fontSize: '12px',
            }}
          >
            <pre style={{ margin: 0 }}>{result.content}</pre>
          </div>
        ) : (
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: '#fff2e8',
              borderRadius: '4px',
              border: '1px solid #ffbb96',
            }}
          >
            <Text code>{result.content}</Text>
          </div>
        )}
      </Descriptions.Item>
    );
  };

  return (
    <PageContainer title="查看接口文档">
      <div style={{ display: 'flex' }}>
        <Card style={{ width: '50%' }} loading={loading}>
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
              <Descriptions.Item label="请求地址">
                {data?.url}
              </Descriptions.Item>
              <Descriptions.Item label="请求类型">
                {data?.method}
              </Descriptions.Item>
              <Descriptions.Item label="请求参数" bordered column={1}>
                <JsonDisplayItem
                  data={apiData}
                  field="requestParams"
                  label="请求参数"
                />
              </Descriptions.Item>
              <Descriptions.Item label="请求头" bordered column={1}>
                <JsonDisplayItem
                  data={apiData}
                  field="requestHeader"
                  label="请求头"
                />
              </Descriptions.Item>
              <Descriptions.Item label="响应头" bordered column={1}>
                <JsonDisplayItem
                  data={apiData}
                  field="responseHeader"
                  label="响应头"
                />
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
        {data ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '10px',
              flex: 1,
            }}
          >
            <Card
              title="在线调试"
              style={{ height: '50%', marginBottom: '10px' }}
            >
              <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item<FieldType>
                  name="requestParams"
                  rules={[{ required: true, message: '请输入请求参数' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    调用
                  </Button>
                </Form.Item>
              </Form>
            </Card>
            <Card
              style={{ height: '50%' }}
              loading={invokeLoading}
              title="返回结果"
            >
              <JsonDisplayItem data={apiData} field="invokeRes" />
            </Card>
          </div>
        ) : (
          <></>
        )}
      </div>
    </PageContainer>
  );
};

export default Index;
