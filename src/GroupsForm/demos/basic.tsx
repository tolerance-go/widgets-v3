import { Button, Cascader, Col, Form, Icon, Input, InputNumber, Row, Tooltip } from 'antd';
import React from 'react';
import {
  BackendFilteredSelect,
  SmartForm,
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
    getAddedItem={({ newItem }) => {
      return {
        ...newItem,
        label: 'hi',
      };
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
            <Col span={12}>
              <Form.Item label="name">
                {getFieldDecorator(`${groupItem.key}.name`, {
                  initialValue: initialItemFormValues?.name,
                })(<Input autoComplete="off" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="E-mail">
                {getFieldDecorator(`${groupItem.key}.email`, {
                  initialValue: initialItemFormValues?.email,
                })(<Input autoComplete="off" />)}
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Password" hasFeedback>
            {getFieldDecorator(`${groupItem.key}.password`, {
              initialValue: initialItemFormValues?.password,
            })(<Input autoComplete="off" />)}
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
