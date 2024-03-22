import { Button, Cascader, Form, Icon, Input, Tooltip } from 'antd';
import React from 'react';
import { DialogForm } from 'widgets-v3';
import delay from 'delay';

const residences = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

export default () => (
  <DialogForm
    type="modal"
    title="标题"
    trigger={<Button type="primary">按钮</Button>}
    renderFormItems={({ form: { getFieldDecorator }, initialFormValues }) => {
      return [
        <Form.Item key={'email'} label="E-mail">
          {getFieldDecorator('email', {
            initialValue: initialFormValues?.email,
            rules: [
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(<Input autoComplete="off" />)}
        </Form.Item>,
        <Form.Item key={'password'} label="Password" hasFeedback>
          {getFieldDecorator('password', {
            initialValue: initialFormValues?.password,
            rules: [
              {
                required: true,
                message: 'Please input your password!',
              },
            ],
          })(<Input.Password autoComplete="off" />)}
        </Form.Item>,
        <Form.Item key={'confirm'} label="Confirm Password" hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: 'Please confirm your password!',
              },
              {},
            ],
          })(<Input.Password />)}
        </Form.Item>,
        <Form.Item
          key={'nickname'}
          label={
            <span>
              Nickname&nbsp;
              <Tooltip title="What do you want others to call you?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('nickname', {
            initialValue: initialFormValues?.nickname,
            rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
          })(<Input />)}
        </Form.Item>,
        <Form.Item key={'residence'} label="Habitual Residence">
          {getFieldDecorator('residence', {
            initialValue: ['zhejiang', 'hangzhou', 'xihu'],
            rules: [
              { type: 'array', required: true, message: 'Please select your habitual residence!' },
            ],
          })(<Cascader options={residences} />)}
        </Form.Item>,
      ];
    }}
    requestInitialFormValues={async () => {
      await delay(1000);
      return {
        email: 'yarnb@qq.com',
        password: 123,
        nickname: 'yarnb',
      };
    }}
  />
);
