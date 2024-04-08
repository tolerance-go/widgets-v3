import { Button, Cascader, Col, Form, Icon, Input, InputNumber, Row, Tooltip } from 'antd';
import React from 'react';
import {
  BackendFilteredSelect,
  ProForm,
  BackendFilteredSelectListItem,
  EditableTable,
  TabsForm,
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
  <GroupsForm
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    request={async (params) => {
      console.log(params);
      await delay(1000);
      return;
    }}
    renderGroupTitle={({ item }) => {
      return `标题-${item.key}`;
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
      groupItem,
      initialItemFormValues,
      index,
      groupItems,
    }) => {
      return (
        <>
          <Row>
            <Col span={index === 0 ? 8 : 12}>
              <Form.Item label="BackendFilteredSelect">
                {getFieldDecorator(`${groupItem.key}.BackendFilteredSelect`, {
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
            </Col>
            <Col span={index === 0 ? 8 : 12}>
              <Form.Item label="E-mail">
                {getFieldDecorator(`${groupItem.key}.email`, {
                  initialValue: initialItemFormValues?.email,
                })(<Input autoComplete="off" />)}
              </Form.Item>
            </Col>
            {index === 0 && (
              <Col span={8}>
                <Form.Item label="other">
                  {getFieldDecorator(`${groupItem.key}.other`, {
                    initialValue: initialItemFormValues?.email,
                  })(<Input autoComplete="off" />)}
                </Form.Item>
              </Col>
            )}
          </Row>

          <Form.Item label="Password" hasFeedback>
            {getFieldDecorator(
              `${groupItem.key}.password`,
              {},
            )(<Input.Password autoComplete="off" />)}
          </Form.Item>

          {groupItems.length - 1 === index && (
            <Form.Item>
              <Button loading={submitLoading} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          )}
        </>
      );
    }}
  />
);
