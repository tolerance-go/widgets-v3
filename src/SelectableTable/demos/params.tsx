import { Button, Form } from 'antd';
import delay from 'delay';
import React, { useState } from 'react';
import {
  BackendFilteredSelectListItem,
  DrawerForm,
  ProDescriptions,
  ProForm,
  SelectableTable,
} from 'widgets-v3';

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

export default () => {
  const [num, setNum] = useState(0);
  return (
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
                  params={{
                    num,
                  }}
                  columns={[
                    {
                      title: '姓名',
                      dataIndex: 'name',
                      key: 'name',
                      filters: [
                        { text: '胡彦斌', value: '胡彦斌' },
                        { text: '胡彦祖', value: '胡彦祖' },
                      ],
                      onFilter: (value, record) => record.name.indexOf(value) === 0,
                    },
                    {
                      title: '年龄',
                      dataIndex: 'age',
                      key: 'age',
                      sorter: (a, b) => a.age - b.age,
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
                  request={async ({ params }) => {
                    console.log(params);
                    await delay(1000);
                    return [
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
                    ];
                  }}
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Button loading={submitLoading} type="primary" htmlType="submit">
                Submit
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setNum(num + 1);
                }}
              >
                修改 params
              </Button>
            </Form.Item>
          </>
        );
      }}
    />
  );
};
