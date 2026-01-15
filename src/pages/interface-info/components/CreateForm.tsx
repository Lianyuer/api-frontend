import { PlusOutlined } from '@ant-design/icons';
import {
  type ActionType,
  ModalForm,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';
import { addInterfaceInfoUsingPost } from '@/services/api-backend/interfaceInfoController';

interface CreateFormProps {
  reload?: ActionType['reload'];
}

const CreateForm: FC<CreateFormProps> = (props) => {
  const { reload } = props;
  const [_messageApi, contextHolder] = message.useMessage();
  const [confirmLoading, setConfirmLoading] = useState(false);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  return (
    <>
      {contextHolder}
      <ModalForm
        title={'新建接口'}
        trigger={
          <Button type="primary" icon={<PlusOutlined />}>
            新建
          </Button>
        }
        initialValues={{
          status: 0,
        }}
        width="400px"
        modalProps={{
          destroyOnHidden: true,
          okButtonProps: {
            confirmLoading,
          },
        }}
        onFinish={async (value) => {
          const convertedValues = {
            ...value,
            status: value.status === true ? 1 : 0,
          };
          setConfirmLoading(true);
          const res = await addInterfaceInfoUsingPost(convertedValues);
          if (res.code === 0) {
            message.success('提交成功');
            // 调用父组件传来的 reload 方法刷新表格
            reload?.();
            setConfirmLoading(false);
            return true;
          } else {
            message.error(res.message);
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '接口名称为必填项',
            },
            {
              max: 15,
              message: '接口名称过长',
            },
          ]}
          width="md"
          name="name"
          label="接口名称"
        />
        <ProFormTextArea
          width="md"
          name="description"
          label="接口描述"
          fieldProps={{ rows: 2 }}
          rules={[
            {
              max: 50,
              message: '接口描述长度不能超过50字符',
            },
          ]}
        />
        <ProFormTextArea
          width="md"
          name="url"
          label="地址"
          fieldProps={{ rows: 1 }}
          rules={[
            {
              required: true,
              message: '接口地址为必填项',
            },
            {
              max: 512,
              message: '接口地址长度不能超过512字符',
            },
          ]}
        />
        <ProFormSelect
          name="method"
          label="请求类型"
          showSearch
          debounceTime={300}
          valueEnum={{
            GET: 'GET',
            POST: 'POST',
            PUT: 'PUT',
            DELETE: 'DELETE',
            FETCH: 'FETCH',
          }}
          placeholder="选择请求类型"
          rules={[{ required: true, message: '请求类型为必填项' }]}
        />
        <ProFormTextArea
          width="md"
          name="requestHeader"
          label="请求头"
          fieldProps={{ rows: 2 }}
          rules={[
            {
              max: 512,
              message: '请求头长度不能超过512字符',
            },
          ]}
        />
        <ProFormTextArea
          width="md"
          name="responseHeader"
          label="响应头"
          fieldProps={{ rows: 2 }}
          rules={[
            {
              max: 512,
              message: '响应头长度不能超过512字符',
            },
          ]}
        />
        <ProFormSwitch
          name="status"
          label="接口状态"
          fieldProps={{
            checkedChildren: '开启',
            unCheckedChildren: '关闭',
          }}
        />
      </ModalForm>
    </>
  );
};
export default CreateForm;
