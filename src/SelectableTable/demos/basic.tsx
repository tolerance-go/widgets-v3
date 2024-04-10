import { Button, Cascader, Col, Form, Icon, Input, InputNumber, Row, Tooltip } from 'antd';
import React from 'react';
import {
  BackendFilteredSelect,
  ProForm,
  BackendFilteredSelectListItem,
  EditableTable,
  TabsForm,
  ModalForm,
  DrawerForm,
  EditableGroups,
  GroupsForm,
  SelectableTable,
  ProDescriptions,
} from 'widgets-v3';
import delay from 'delay';

const generateChildren = (total: number): BackendFilteredSelectListItem[] => {
  const children: BackendFilteredSelectListItem[] = [];
  for (let i = 0; i < total; i++) {
    children.push({
      value: 'value-' + i,
      label: 'label-' + i,
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
          <Form.Item label="SelectableTable">
            {getFieldDecorator('SelectableTable', {
              initialValue: ['1'],
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <SelectableTable
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
                                                        props: {
                                                          label: 'Name',
                                                          children: 'John Doe',
                                                        },
                                                      },
                                                      {
                                                        type: 'DescriptionsItem',
                                                        props: { label: 'Age', children: '30' },
                                                      },
                                                      {
                                                        type: 'DescriptionsItem',
                                                        props: {
                                                          label: 'Country',
                                                          children: 'USA',
                                                        },
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
                                                        props: {
                                                          label: 'Name',
                                                          children: 'Jane Doe',
                                                        },
                                                      },
                                                      {
                                                        type: 'DescriptionsItem',
                                                        props: { label: 'Age', children: '28' },
                                                      },
                                                      {
                                                        type: 'DescriptionsItem',
                                                        props: {
                                                          label: 'Country',
                                                          children: 'Canada',
                                                        },
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
                // searchForm={{
                //   renderFormItems: ({ form: { getFieldDecorator } }) => {
                //     return [
                //       <Form.Item label="E-mail">
                //         {getFieldDecorator('email', {})(<Input autoComplete="off" />)}
                //       </Form.Item>,
                //       <Form.Item label="Password" hasFeedback>
                //         {getFieldDecorator('password', {
                //           rules: [],
                //         })(<Input.Password autoComplete="off" />)}
                //       </Form.Item>,
                //       <Form.Item label="Confirm Password" hasFeedback>
                //         {getFieldDecorator('confirm', {
                //           rules: [],
                //         })(<Input.Password />)}
                //       </Form.Item>,
                //       <Form.Item
                //         label={
                //           <span>
                //             Nickname&nbsp;
                //             <Tooltip title="What do you want others to call you?">
                //               <Icon type="question-circle-o" />
                //             </Tooltip>
                //           </span>
                //         }
                //       >
                //         {getFieldDecorator('nickname', {})(<Input />)}
                //       </Form.Item>,
                //       <Form.Item label="Habitual Residence">
                //         {getFieldDecorator('residence', {
                //           initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                //           // rules: [
                //           //   {
                //           //     type: 'array',
                //           //     required: true,
                //           //     message: 'Please select your habitual residence!',
                //           //   },
                //           // ],
                //         })(<Cascader options={residences} />)}
                //       </Form.Item>,
                //     ];
                //   },
                // }}
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
              />,
            )}
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
