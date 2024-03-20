import { Button, Cascader, Form, Icon, Input, Tooltip } from 'antd';
import React from 'react';
import { BackendFilteredSelect, ProForm, BackendFilteredSelectListItem } from 'widgets-v3';
import delay from 'delay';

const generateChildren = (total: number): BackendFilteredSelectListItem[] => {
  const children: BackendFilteredSelectListItem[] = [];
  for (let i = 0; i < total; i++) {
    children.push({
      value: i.toString() + i,
      label: i.toString() + i,
    });
  }
  return children;
};

const getPageItems = (
  page: number,
  pageSize: number,
  total: number,
): BackendFilteredSelectListItem[] => {
  const children = generateChildren(total);
  // 计算开始索引和结束索引
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  // 返回当前页的数组子集
  return children.slice(startIndex, endIndex);
};

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
  <ProForm
    request={async (params) => {
      console.log(params);
      await delay(1000);
      return;
    }}
    renderFormItems={({ form: { getFieldDecorator }, submitLoading }) => {
      return (
        <>
          <Form.Item label="BackendFilteredSelect">
            {getFieldDecorator('BackendFilteredSelect', {
              rules: [
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ],
            })(
              <BackendFilteredSelect
                placeholder="请选择"
                pageSize={50}
                request={async (params) => {
                  console.log('发出请求', params);
                  await delay(1000);
                  return {
                    list: getPageItems(params.current, params.pageSize, 100),
                    total: 100,
                  };
                }}
              />,
            )}
          </Form.Item>
          <Form.Item label="E-mail">
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ],
            })(<Input autoComplete="off" />)}
          </Form.Item>
          <Form.Item label="Password" hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ],
            })(<Input.Password autoComplete="off" />)}
          </Form.Item>
          <Form.Item label="Confirm Password" hasFeedback>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                {},
              ],
            })(<Input.Password />)}
          </Form.Item>
          <Form.Item
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
              rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Habitual Residence">
            {getFieldDecorator('residence', {
              initialValue: ['zhejiang', 'hangzhou', 'xihu'],
              rules: [
                {
                  type: 'array',
                  required: true,
                  message: 'Please select your habitual residence!',
                },
              ],
            })(<Cascader options={residences} />)}
          </Form.Item>
          <Form.Item>
            <Button loading={submitLoading} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </>
      );
    }}
  />
);
