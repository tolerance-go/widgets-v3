import { Button, Checkbox, Form, Icon, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { WrappedFormUtils } from 'antd/es/form/Form';
import React, { FormEvent, useEffect, useLayoutEffect, useState } from 'react';
import { handleError } from 'src/_utils/handleError';

type PhoneLoginFormInnerProps = {
  handleSubmit: (form: WrappedFormUtils) => (e: FormEvent<HTMLFormElement>) => void;
  submitLoading: boolean;
  requestCaptcha?: () => Promise<void>;
} & FormComponentProps;

const captchaTimestampKey = 'captchaTimestamp'

const PhoneLoginInnerForm = ({
  form,
  form: { getFieldDecorator },
  handleSubmit,
  submitLoading,
  requestCaptcha,
  ...restFormProps
}: PhoneLoginFormInnerProps) => {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(() => {
    const captchaTimestamp = localStorage.getItem(captchaTimestampKey);
    if (captchaTimestamp) {
      const now = new Date().getTime();
      const timePassed = now - parseInt(captchaTimestamp, 10);
      const countdown = 60 - Math.floor(timePassed / 1000);
      if (countdown > 0) {
        return countdown;
      }
    }

    return null;
  });

  const fetchCaptcha = async () => {
    try {
      if (!requestCaptcha) {
        return;
      }

      setLoading(true);
      await requestCaptcha();
      const now = new Date().getTime();
      localStorage.setItem(captchaTimestampKey, now.toString());
      setTimeLeft(60); // Start the countdown
    } catch (error) {
      handleError(error, '获取验证码异常'); // Using the common error handling function
    } finally {
      setLoading(false);
    }
  };

  // Countdown logic
  useEffect(() => {
    let interval: number | null = null;
    if (timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => (prevTimeLeft !== null ? prevTimeLeft - 1 : null));
      }, 1000);
    } else if (timeLeft === 0) {
      setTimeLeft(null); // Reset the countdown
      localStorage.removeItem(captchaTimestampKey); // Clear the timestamp
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeLeft]);

  return (
    <Form {...restFormProps} onSubmit={handleSubmit(form)} className="wg-login-form">
      <Form.Item>
        {getFieldDecorator('phoneNumber', {
          rules: [{ required: true, message: '请输入手机号' }],
        })(
          <Input
            prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="请输入手机号"
          />,
        )}
      </Form.Item>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Form.Item
          style={{
            flexGrow: 1,
            marginRight: 10,
          }}
        >
          {getFieldDecorator('captcha', {
            rules: [{ required: true, message: '请输入验证码' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="captcha"
              placeholder="请输入验证码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={fetchCaptcha}
            disabled={timeLeft !== null}
            loading={loading}
          >
            {timeLeft !== null ? `${timeLeft} 秒后重新发送` : '获取验证码'}
          </Button>
        </Form.Item>
      </div>
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

const PhoneLoginForm = Form.create<PhoneLoginFormInnerProps>({ name: 'PhoneLoginForm' })(
  PhoneLoginInnerForm,
);

export default PhoneLoginForm;
