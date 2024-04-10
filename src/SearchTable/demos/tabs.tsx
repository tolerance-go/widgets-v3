import { Button, Cascader, Form, Icon, Input, Tooltip } from 'antd';
import React from 'react';
import { Action, SearchTable, SearchTableProps } from 'widgets-v3';
import delay from 'delay';
type ExcludeFunctionsAndNullish<T> = Exclude<T, Function | null | undefined>;

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
  <SearchTable
    tabs={[
      {
        key: '1',
        title: '中学',
        data: {
          test: 0,
        },
      },
      {
        key: '2',
        title: '小学',
        data: {
          test: 1,
        },
      },
    ]}
    columns={({ activeTabKey }) =>
      (
        [
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
        ] as ExcludeFunctionsAndNullish<SearchTableProps<any>['columns']>
      ).concat(
        activeTabKey === '1'
          ? [
              {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: () => {
                  return (
                    <>
                      <Button style={{ marginLeft: 0 }} size="small" type="link">
                        查看订单
                      </Button>
                      <Button onClick={() => {}} style={{ marginLeft: 8 }} size="small" type="link">
                        审核
                      </Button>
                    </>
                  );
                },
              },
            ]
          : [],
      )
    }
    searchForm={(searchFormParams) => {
      return {
        renderFormItems: ({ form: { getFieldDecorator } }) => {
          return [
            searchFormParams.activeTabKey === '1' ? (
              <Form.Item label="中学">
                {getFieldDecorator('email', {})(<Input autoComplete="off" />)}
              </Form.Item>
            ) : (
              <Form.Item label="小学">
                {getFieldDecorator('email', {})(<Input.Password autoComplete="off" />)}
              </Form.Item>
            ),
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
      };
    }}
    renderActionGroup={(renderActionGroupParams) => {
      return [
        <Action
          key="btn1"
          trigger={
            <Button type="primary">
              {renderActionGroupParams.activeTabKey === '1' ? '中学' : '小学'}
            </Button>
          }
          request={async () => {
            await delay(1000);
          }}
        />,
        <Action
          key="btn2"
          trigger={<Button type="primary">按钮2</Button>}
          request={async () => {
            await delay(1000);
          }}
        />,
      ];
    }}
    request={async (params) => {
      console.log('params', params);
      await delay(1000);
      return {
        total: 100,
        list: [
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
