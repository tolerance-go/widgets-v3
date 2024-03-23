import { Button, Cascader, Form, Icon, Input, Tooltip } from 'antd';
import React from 'react';
import { Action, DrawerForm, ProDescriptions, SearchTable } from 'widgets-v3';
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
  <SearchTable
    headerTitle="批量选择"
    rowSelection={{}}
    renderActionGroup={({ selectedRowsInfo }) => {
      return [
        <Action
          key="btn1"
          trigger={
            <Button type="primary">批量处理(选中了{selectedRowsInfo.selectedRows.length}项)</Button>
          }
          request={async () => {
            await delay(1000);
          }}
        />,
      ];
    }}
    renderBatchActionGroup={({ selectedRowsInfo, methods }) => {
      return [
        <Action
          key="btn1"
          trigger={
            <Button type="link" size="small">
              批量操作1
            </Button>
          }
          request={async () => {
            await delay(1000);
            methods.reload({
              pagination: {
                current: 1,
              },
            });
          }}
        />,
        <Action
          key="btn12"
          trigger={
            <Button type="link" size="small">
              批量操作2
            </Button>
          }
          request={async () => {
            await delay(1000);
            methods.reload({
              pagination: {
                current: 1,
              },
            });
          }}
        />,
      ];
    }}
    renderSelectionDetail={({ selectedRowsInfo }) => {
      return (
        <span>
          容器数量: {selectedRowsInfo.selectedRowKeys.length * 11} 个 调用量:{' '}
          {selectedRowsInfo.selectedRowKeys.length * 100} 次
        </span>
      );
    }}
    columns={[
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
      {
        title: '操作',
        align: 'center',
        render: () => {
          return (
            <span>
              <DrawerForm
                title="查看"
                trigger={<Button type="link">查看</Button>}
                renderFormItems={() => {
                  return (
                    <ProDescriptions
                      request={async () => {
                        await delay(1000);
                        return {
                          email: 'yarnb@qq.com',
                          password: 123,
                          nickname: 'yarnb',
                        };
                      }}
                    >
                      {(data) => {
                        return [
                          {
                            type: 'Tabs',
                            props: {},
                            children: [
                              {
                                type: 'TabPane',
                                props: { tab: 'Tab 1' },
                                children: [
                                  {
                                    type: 'Card',
                                    props: { title: 'Card Title 1' },
                                    children: [
                                      {
                                        type: 'Descriptions',
                                        props: { title: 'User Info 1' },
                                        children: [
                                          {
                                            type: 'DescriptionsItem',
                                            props: { label: 'Name', children: 'John Doe' },
                                          },
                                          {
                                            type: 'DescriptionsItem',
                                            props: { label: 'Age', children: '30' },
                                          },
                                          {
                                            type: 'DescriptionsItem',
                                            props: { label: 'Country', children: 'USA' },
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                              {
                                type: 'TabPane',
                                props: { tab: 'Tab 2' },
                                children: [
                                  {
                                    type: 'Card',
                                    props: { title: 'Card Title 2' },
                                    children: [
                                      {
                                        type: 'Descriptions',
                                        props: { title: 'User Info 2' },
                                        children: [
                                          {
                                            type: 'DescriptionsItem',
                                            props: { label: 'Name', children: 'Jane Doe' },
                                          },
                                          {
                                            type: 'DescriptionsItem',
                                            props: { label: 'Age', children: '28' },
                                          },
                                          {
                                            type: 'DescriptionsItem',
                                            props: { label: 'Country', children: 'Canada' },
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ];
                      }}
                    </ProDescriptions>
                  );
                }}
              ></DrawerForm>
            </span>
          );
        },
      },
    ]}
    searchForm={{
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
