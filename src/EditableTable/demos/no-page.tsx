import React from 'react';
import { Button, Form, Input, Table, Popconfirm, DatePicker, InputNumber } from 'antd';
import { EditableTable } from 'widgets-v3';

// 创建演示页面组件
const DemoPage = () => {
  return (
    <>
      <EditableTable
        pagination={false}
        columns={[
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            fieldDecoratorOptions: {
              rules: [
                {
                  required: true,
                },
              ],
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
        initialData={[
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
        ]}
      />
    </>
  );
};

export default DemoPage;
