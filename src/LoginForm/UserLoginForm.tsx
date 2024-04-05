import { Button, Checkbox, Form, Icon, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { WrappedFormUtils } from 'antd/es/form/Form';
import React, { FormEvent } from 'react';

type UserLoginFormInnerProps = {
  handleSubmit: (form: WrappedFormUtils) => (e: FormEvent<HTMLFormElement>) => void;
  submitLoading: boolean;
} & FormComponentProps;

const UserLoginInnerForm = ({
  form,
  form: { getFieldDecorator },
  handleSubmit,
  submitLoading,
  ...restFormProps
}: UserLoginFormInnerProps) => {
  return (
    <Form {...restFormProps} onSubmit={handleSubmit(form)} className="wg-login-form">
      <Form.Item>
        {getFieldDecorator('username', {
          rules: [{ required: true, message: '请输入用户名' }],
        })(
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="请输入用户名"
          />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: '请输入密码' }],
        })(
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="请输入密码"
          />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('remember', {
          valuePropName: 'checked',
          initialValue: true,
        })(<Checkbox>自动登录</Checkbox>)}
        <a className="wg-login-form-forgot" href="">
          忘记密码？
        </a>
        <Button
          type="primary"
          htmlType="submit"
          loading={submitLoading}
          className="wg-login-form-button"
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

const UserLoginForm = Form.create<UserLoginFormInnerProps>({ name: 'UserLoginForm' })(
  UserLoginInnerForm,
);

export default UserLoginForm;
