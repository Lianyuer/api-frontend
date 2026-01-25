import { updateInterfaceInfoUsingPost } from "@/services/api-backend/interfaceInfoController";
import {
  type ActionType,
  ModalForm,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { App } from "antd";
import React, { useState } from "react";

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RuleListItem>;

export type UpdateFormProps = {
  values: Partial<API.RuleListItem>;
  reload?: ActionType["reload"];
};
const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { reload, values } = props;
  const { message } = App.useApp(); // 使用 App 的 hook
  const [confirmLoading, setConfirmLoading] = useState(false);

  return (
    <ModalForm
      title={"修改接口"}
      trigger={<a>修改</a>}
      initialValues={values}
      width="400px"
      modalProps={{
        destroyOnHidden: true,
        okButtonProps: {
          confirmLoading,
        },
      }}
      onFinish={async (value) => {
        setConfirmLoading(true);
        const res = await updateInterfaceInfoUsingPost({
          ...value,
          id: values.id,
          status: value.status === true ? 1 : 0,
        });
        if (res.code === 0) {
          message.success("提交成功");
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
      <ProFormSwitch
        name="status"
        label="接口状态"
        fieldProps={{
          checkedChildren: "开启",
          unCheckedChildren: "关闭",
        }}
      />
    </ModalForm>
  );
};
export default UpdateForm;
