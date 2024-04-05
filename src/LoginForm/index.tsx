import { Button, Checkbox, Form, Icon, Input, Tabs } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import React, { FormEvent, useState } from 'react';
import './index.less';
import { handleError } from 'src/_utils/handleError';
import UserLoginForm from './UserLoginForm';
import PhoneLoginForm from './PhoneLoginForm';
import { WrappedFormUtils } from 'antd/es/form/Form';

type UserFormValues = {
  username: string;
  password: string;
};

type PhoneFormValues = {
  phoneNumber: string;
  captcha: string;
};

export type LoginFormProps = {
  request?: (
    params:
      | {
          type: 'user';
          formValues: UserFormValues;
        }
      | {
          type: 'phone';
          formValues: PhoneFormValues;
        },
  ) => Promise<void>;
  requestCaptcha?: () => Promise<void>;
};

const LoginForm = ({ request, requestCaptcha, ...restFormProps }: LoginFormProps) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const handleSubmit =
    (type: 'user' | 'phone') =>
    (form: WrappedFormUtils) =>
    async (e: FormEvent<HTMLFormElement>) => {
      try {
        e.preventDefault();

        if (!request) {
          return;
        }

        const formValues = await new Promise<UserFormValues | PhoneFormValues>(
          (resolve, reject) => {
            form.validateFieldsAndScroll((err, values) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(values);
            });
          },
        );

        setSubmitLoading(true);
        if (type === 'user') {
          await request({
            type,
            formValues: formValues as UserFormValues,
          });
        } else {
          await request({
            type,
            formValues: formValues as PhoneFormValues,
          });
        }
      } catch (error) {
        handleError(error, '提交表单失败'); // Using the common error handling function
      } finally {
        setSubmitLoading(false);
      }
    };

  return (
    <div className="wg-login-form-wrapper">
      <Tabs animated={false}>
        <Tabs.TabPane tab="账户密码登录" key="user">
          <UserLoginForm
            {...restFormProps}
            submitLoading={submitLoading}
            handleSubmit={handleSubmit('user')}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="手机号登录" key="phone">
          <PhoneLoginForm
            {...restFormProps}
            submitLoading={submitLoading}
            requestCaptcha={requestCaptcha}
            handleSubmit={handleSubmit('phone')}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default LoginForm;
