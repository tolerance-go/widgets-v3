import { Button, Cascader, Form, Icon, Input, InputNumber, Tooltip } from 'antd';
import React from 'react';
import {
  BackendFilteredSelect,
  SmartForm,
  BackendFilteredSelectListItem,
  EditableTable,
  TabsForm,
  StepsForm,
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
  <StepsForm
    request={async (params) => {
      console.log(params);
      await delay(1000);
      return;
    }}
    steps={[
      { key: 'key1', title: '第一步', subTitle: '子标题' },
      { key: 'key2', title: '第二步' },
      { key: 'key3', title: '第三步' },
    ]}
    requestInitialFormValues={async () => {
      await delay(1000);
      return {
        key1: {
          email: '123@qq.com',
        },
        key2: {
          email: '321@qq.com',
        },
      };
    }}
    renderItemFormItems={({
      form: { getFieldDecorator },
      submitLoading,
      stepItem,
      initialItemFormValues,
    }) => {
      return (
        <>
          <Form.Item label="BackendFilteredSelect">
            {getFieldDecorator(`${stepItem.key}.BackendFilteredSelect`, {
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
            {getFieldDecorator(`${stepItem.key}.email`, {
              initialValue: initialItemFormValues?.email,
            })(<Input autoComplete="off" />)}
          </Form.Item>
          <Form.Item label="Password" hasFeedback>
            {getFieldDecorator(
              `${stepItem.key}.password`,
              {},
            )(<Input.Password autoComplete="off" />)}
          </Form.Item>
          <Form.Item label="Confirm Password" hasFeedback>
            {getFieldDecorator(`${stepItem.key}.confirm`, {})(<Input.Password />)}
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
            {getFieldDecorator(`${stepItem.key}.nickname`, {
              rules: [{ message: 'Please input your nickname!', whitespace: true }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Habitual Residence">
            {getFieldDecorator(`${stepItem.key}.residence`, {
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
            {getFieldDecorator(`${stepItem.key}.res234234idence`, {
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
);
