import { message } from 'antd';
import delay from 'delay';
import React from 'react';
import { LoginForm } from 'widgets-v3';

export default () => (
  <LoginForm
    request={async ({ type, formValues }) => {
      console.log(type, formValues);
      await delay(1000);
    }}
    requestCaptcha={async () => {
      await delay(1000);
      message.success('验证码已发送');
    }}
  />
);
