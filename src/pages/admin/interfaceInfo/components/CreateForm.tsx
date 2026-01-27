import { addInterfaceInfoUsingPost } from "@/services/api-backend/interfaceInfoController";
import { PlusOutlined } from "@ant-design/icons";
import {
  type ActionType,
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { App, Button } from "antd";
import React, { useState } from "react";

interface CreateFormProps {
  actionRef: React.RefObject<ActionType | null>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { actionRef } = props;
  const { message } = App.useApp(); // 使用 App 的 hook
  const [confirmLoading, setConfirmLoading] = useState(false);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  return (
    <ModalForm
      title={"新建接口"}
      trigger={
        <Button type="primary" icon={<PlusOutlined />}>
          新建
        </Button>
      }
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
        };
        setConfirmLoading(true);
        const res = await addInterfaceInfoUsingPost(convertedValues);
        if (res.code === 0) {
          message.success("提交成功");
          // 直接从 actionRef.current 调用 reload
          if (actionRef.current?.reload) {
            actionRef.current.reload();
          }
          setConfirmLoading(false);
          return true;
        } else {
          message.error(res.message);
          return false;
        }
      }}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: "接口名称为必填项",
          },
          {
            max: 15,
            message: "接口名称过长",
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
            message: "接口描述长度不能超过50字符",
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
            message: "接口地址为必填项",
          },
          {
            max: 512,
            message: "接口地址长度不能超过512字符",
          },
        ]}
      />
      <ProFormSelect
        name="method"
        label="请求类型"
        showSearch
        debounceTime={300}
        valueEnum={{
          GET: "GET",
          POST: "POST",
          PUT: "PUT",
          DELETE: "DELETE",
          PATCH: "PATCH",
        }}
        placeholder="选择请求类型"
        rules={[{ required: true, message: "请求类型为必填项" }]}
      />
      <ProFormTextArea
        width="md"
        name="requestHeader"
        label="请求头"
        fieldProps={{ rows: 2 }}
        rules={[
          {
            max: 512,
            message: "请求头长度不能超过512字符",
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
            message: "响应头长度不能超过512字符",
          },
        ]}
      />
    </ModalForm>
  );
};
export default CreateForm;
