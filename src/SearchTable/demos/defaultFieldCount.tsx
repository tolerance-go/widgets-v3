import { Cascader, Form, Icon, Input, Tooltip } from 'antd';
import React from 'react';
import { SearchTable } from 'widgets-v3';
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

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    filters: [
      { text: 'Joe', value: 'Joe' },
      { text: 'Jim', value: 'Jim' },
    ],
    sorter: true,
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];

export default () => (
  <SearchTable
    columns={columns}
    searchForm={{
      defaultFieldCount: 3,
      itemSpan: 6,
      renderFormItems: ({ form: { getFieldDecorator } }) => {
        return [
          <Form.Item label="E-mail">
            {getFieldDecorator('email', {})(<Input autoComplete="off" />)}
          </Form.Item>,
          <Form.Item label="Password" hasFeedback>
            {getFieldDecorator('password', {
              rules: [],
            })(<Input.Password autoComplete="off" />)}
          </Form.Item>,
          <Form.Item label="Confirm Password" hasFeedback>
            {getFieldDecorator('confirm', {
              rules: [],
            })(<Input.Password />)}
          </Form.Item>,
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
            {getFieldDecorator('nickname', {})(<Input />)}
          </Form.Item>,
          <Form.Item label="Habitual Residence">
            {getFieldDecorator('residence', {
              initialValue: ['zhejiang', 'hangzhou', 'xihu'],
              // rules: [
              //   {
              //     type: 'array',
              //     required: true,
              //     message: 'Please select your habitual residence!',
              //   },
              // ],
            })(<Cascader options={residences} />)}
          </Form.Item>,
        ];
      },
    }}
    request={async (params) => {
      console.log('params', params);
      await delay(1000);
      return {
        total: 100,
        data: [
          {
            key: '1',
            name: '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号',
          },
          {
            key: '2',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号',
          },
        ],
      };
    }}
  />
);
