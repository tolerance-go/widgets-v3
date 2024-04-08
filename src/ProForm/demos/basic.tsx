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

const editableInitialData = [
  {
    key: '1',
    name: 'John Doe',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
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
            {getFieldDecorator('email', {})(<Input autoComplete="off" />)}
          </Form.Item>
          <Form.Item label="Password" hasFeedback>
            {getFieldDecorator('password', {})(<Input.Password autoComplete="off" />)}
          </Form.Item>
          <Form.Item label="Confirm Password" hasFeedback>
            {getFieldDecorator('confirm', {})(<Input.Password />)}
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
              rules: [{ message: 'Please input your nickname!', whitespace: true }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Habitual Residence">
            {getFieldDecorator('residence', {
              initialValue: ['zhejiang', 'hangzhou', 'xihu'],
              rules: [
                {
                  type: 'array',

                  message: 'Please select your habitual residence!',
                },
              ],
            })(<Cascader options={residences} />)}
          </Form.Item>
          <Form.Item label="EditableTable">
            {getFieldDecorator('res234234idence', {
              initialValue: editableInitialData,
              rules: [
                {
                  type: 'array',

                  message: 'Please select your habitual residence!',
                },
              ],
            })(
              <EditableTable
                pagination={{
                  defaultPageSize: 2,
                }}
                columns={[
                  {
                    title: '姓名',
                    dataIndex: 'name',
                    key: 'name',
                    fieldDecoratorOptions: {
                      rules: [{}],
                    },
                    editable: true, // 让这列可编辑
                  },
                  {
                    title: '年龄',
                    dataIndex: 'age',
                    key: 'age',
                    editable: true,
                    renderInput(val, record, index, form) {
                      return <InputNumber></InputNumber>;
                    },
                  },
                  {
                    title: '住址',
                    dataIndex: 'address',
                    key: 'address',
                  },
                ]}
              />,
            )}
          </Form.Item>
          <Form.Item label="TabsForm">
            <TabsForm
              initialTabItems={[
                {
                  key: 'key1',
                  label: 'tab1',
                },
                {
                  key: 'key2',
                  label: 'tab2',
                },
              ]}
              initialFormValues={{
                key1: {
                  email: '123@qq.com',
                },
                key2: {
                  email: '321@qq.com',
                },
              }}
              renderItemFormItems={({ submitLoading, tabItem, initialItemFormValues, form }) => {
                return (
                  <>
                    <Form.Item label="BackendFilteredSelect">
                      {form.getFieldDecorator(`TabsForm.[${tabItem.key}].BackendFilteredSelect`, {
                        preserve: false,
                        rules: [
                          {
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
                      {form.getFieldDecorator(`TabsForm.[${tabItem.key}].email`, {
                        preserve: false,
                        initialValue: initialItemFormValues?.email,
                      })(<Input autoComplete="off" />)}
                    </Form.Item>
                    <Form.Item label="Password" hasFeedback>
                      {form.getFieldDecorator(`TabsForm.[${tabItem.key}].password`, {
                        preserve: false,
                      })(<Input.Password autoComplete="off" />)}
                    </Form.Item>
                    <Form.Item label="Confirm Password" hasFeedback>
                      {form.getFieldDecorator(`TabsForm.[${tabItem.key}].confirm`, {
                        preserve: false,
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
                      {form.getFieldDecorator(`TabsForm.[${tabItem.key}].nickname`, {
                        preserve: false,
                        rules: [{ message: 'Please input your nickname!', whitespace: true }],
                      })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Habitual Residence">
                      {form.getFieldDecorator(`TabsForm.[${tabItem.key}].residence`, {
                        preserve: false,
                        initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                        rules: [
                          {
                            type: 'array',

                            message: 'Please select your habitual residence!',
                          },
                        ],
                      })(<Cascader options={residences} />)}
                    </Form.Item>
                    <Form.Item label="EditableTable">
                      {form.getFieldDecorator(`TabsForm.[${tabItem.key}].res234234idence`, {
                        preserve: false,
                        initialValue: editableInitialData,
                        rules: [
                          {
                            type: 'array',

                            message: 'Please select your habitual residence!',
                          },
                        ],
                      })(
                        <EditableTable
                          pagination={{
                            defaultPageSize: 2,
                          }}
                          columns={[
                            {
                              title: '姓名',
                              dataIndex: 'name',
                              key: 'name',
                              fieldDecoratorOptions: {
                                rules: [{}],
                              },
                              editable: true, // 让这列可编辑
                            },
                            {
                              title: '年龄',
                              dataIndex: 'age',
                              key: 'age',
                              editable: true,
                              renderInput(val, record, index, form) {
                                return <InputNumber></InputNumber>;
                              },
                            },
                            {
                              title: '住址',
                              dataIndex: 'address',
                              key: 'address',
                            },
                          ]}
                        />,
                      )}
                    </Form.Item>
                  </>
                );
              }}
            />
          </Form.Item>
          <Form.Item label="ModalForm">
            <ModalForm
              title="标题"
              trigger={<Button type="primary">按钮</Button>}
              renderFormItems={({ form }) => {
                return [
                  <Form.Item key={'email'} label="E-mail">
                    {form.getFieldDecorator('ModalForm.email', {
                      rules: [
                        {
                          message: 'Please input your E-mail!',
                        },
                      ],
                    })(<Input autoComplete="off" />)}
                  </Form.Item>,
                  <Form.Item key={'password'} label="Password" hasFeedback>
                    {form.getFieldDecorator('ModalForm.password', {
                      rules: [
                        {
                          message: 'Please input your password!',
                        },
                      ],
                    })(<Input.Password autoComplete="off" />)}
                  </Form.Item>,
                  <Form.Item key={'confirm'} label="Confirm Password" hasFeedback>
                    {form.getFieldDecorator('ModalForm.confirm', {
                      rules: [
                        {
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
                    {form.getFieldDecorator('ModalForm.nickname', {
                      rules: [
                        {
                          message: 'Please input your nickname!',
                          whitespace: true,
                        },
                      ],
                    })(<Input />)}
                  </Form.Item>,
                  <Form.Item key={'residence'} label="Habitual Residence">
                    {form.getFieldDecorator('ModalForm.residence', {
                      initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                      rules: [
                        {
                          type: 'array',

                          message: 'Please select your habitual residence!',
                        },
                      ],
                    })(<Cascader options={residences} />)}
                  </Form.Item>,
                ];
              }}
            />
          </Form.Item>

          <Form.Item label="DrawerForm">
            <DrawerForm
              title="标题"
              trigger={<Button type="primary">按钮</Button>}
              renderFormItems={({ form }) => {
                return [
                  <Form.Item key={'email'} label="E-mail">
                    {form.getFieldDecorator('DrawerForm.email', {
                      rules: [
                        {
                          message: 'Please input your E-mail!',
                        },
                      ],
                    })(<Input autoComplete="off" />)}
                  </Form.Item>,
                  <Form.Item key={'password'} label="Password" hasFeedback>
                    {form.getFieldDecorator('DrawerForm.password', {
                      rules: [
                        {
                          message: 'Please input your password!',
                        },
                      ],
                    })(<Input.Password autoComplete="off" />)}
                  </Form.Item>,
                  <Form.Item key={'confirm'} label="Confirm Password" hasFeedback>
                    {form.getFieldDecorator('DrawerForm.confirm', {
                      rules: [
                        {
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
                    {form.getFieldDecorator('DrawerForm.nickname', {
                      rules: [
                        {
                          message: 'Please input your nickname!',
                          whitespace: true,
                        },
                      ],
                    })(<Input />)}
                  </Form.Item>,
                  <Form.Item key={'residence'} label="Habitual Residence">
                    {form.getFieldDecorator('DrawerForm.residence', {
                      initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                      rules: [
                        {
                          type: 'array',

                          message: 'Please select your habitual residence!',
                        },
                      ],
                    })(<Cascader options={residences} />)}
                  </Form.Item>,
                ];
              }}
            />
          </Form.Item>
          <Form.Item label="EditableGroups">
            <GroupsForm
              mergeIntoForm={'EditableGroups'}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              request={async (params) => {
                console.log(params);
                await delay(1000);
                return;
              }}
              renderGroupTitle={({ item }) => {
                return `标题-${item.label}`;
              }}
              initialGroupItems={[
                {
                  key: 'key1',
                  label: 'tab1',
                },
                {
                  key: 'key2',
                  label: 'tab2',
                },
              ]}
              initialFormValues={{
                key1: {
                  email: '123@qq.com',
                },
                key2: {
                  email: '321@qq.com',
                },
              }}
              renderItemFormItems={({
                form: { getFieldDecorator },
                submitLoading,
                groupItem,
                initialItemFormValues,
                index,
                groupItems,
                parentsFieldId,
              }) => {
                return (
                  <>
                    <Row gutter={10}>
                      <Col span={12}>
                        <Form.Item label="name">
                          {getFieldDecorator(`${parentsFieldId}${groupItem.key}.name`, {
                            initialValue: initialItemFormValues?.name,
                          })(<Input autoComplete="off" />)}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="E-mail">
                          {getFieldDecorator(`${parentsFieldId}${groupItem.key}.email`, {
                            initialValue: initialItemFormValues?.email,
                          })(<Input autoComplete="off" />)}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item label="Password" hasFeedback>
                      {getFieldDecorator(`${parentsFieldId}${groupItem.key}.password`, {
                        initialValue: initialItemFormValues?.password,
                      })(<Input autoComplete="off" />)}
                    </Form.Item>
                  </>
                );
              }}
            />
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
