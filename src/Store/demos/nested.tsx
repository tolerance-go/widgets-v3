import { Button, Cascader, Form, Icon, Input, Tooltip } from 'antd';
import React, { useContext } from 'react';
import {
  DrawerForm,
  ProDescriptions,
  SearchTable,
  Store,
  StoreContext,
  useStore,
} from 'widgets-v3';
import delay from 'delay';

const Child = () => {
  const component = useStore('component');
  const global = useStore('global');
  const unknown = useStore('unknown');
  return (
    <div style={{ border: '1px solid', padding: 10 }}>
      <div>component: {JSON.stringify(component)}</div>
      <div>global: {JSON.stringify(global)}</div>
      <div>unknown: {JSON.stringify(unknown)}</div>
    </div>
  );
};

export default () => (
  <Store
    request={async () => {
      await delay(5000);
      return {
        userInfo: {
          nickname: 'yarnb',
        },
      };
    }}
    name="global"
  >
    {(global) => {
      return (
        <div style={{ border: '1px solid', padding: 10 }}>
          {JSON.stringify(global)}
          <Store
            request={async () => {
              await delay(1000);
              return {
                componentInfo: 'componentInfo',
              };
            }}
            name="component"
            depends={['global']}
          >
            {(component) => {
              return (
                <div style={{ border: '1px solid', padding: 10 }}>
                  <div>component: {JSON.stringify(component)}</div>
                  <Child />
                </div>
              );
            }}
          </Store>
          <Store
            depends={['global']}
            request={async () => {
              await delay(3000);
              const skinColorTypeMap = new Map([
                [1, '黄色'],
                [2, '白色'],
                [3, '黑色'],
              ]);

              return {
                skinColorTypeMap,
              };
            }}
          >
            {({ skinColorTypeMap }) => {
              return (
                <div style={{ border: '1px solid', padding: 10 }}>
                  <SearchTable
                    columns={[
                      {
                        title: '操作人',
                        key: 'operator',
                        render: () => global.userInfo?.nickname,
                      },
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
                        title: '肤色',
                        dataIndex: 'skinColorType',
                        key: 'skinColorType',
                        render(text, record, index) {
                          return skinColorTypeMap?.get(text);
                        },
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
                        ];
                      },
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
                            skinColorType: 1,
                          },
                          {
                            key: '2',
                            name: '胡彦祖',
                            age: 42,
                            address: '西湖区湖底公园1号',
                            skinColorType: 2,
                          },
                        ],
                      };
                    }}
                  />
                </div>
              );
            }}
          </Store>
        </div>
      );
    }}
  </Store>
);
