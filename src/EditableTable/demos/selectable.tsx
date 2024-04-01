import React, { useState } from 'react';
import { Button, Form, Input, Table, Popconfirm, DatePicker, InputNumber, Checkbox } from 'antd';
import { EditableTable } from 'widgets-v3';

// 创建演示页面组件
const DemoPage = () => {
  const [value, onChange] = useState([
    {
      key: '1',
      name: 'John Doe',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      rowSelected: true,
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
  ]);
  return (
    <>
      <EditableTable
        value={value}
        onChange={(data) => onChange(data)}
        pagination={{
          defaultPageSize: 2,
        }}
        rowSelection={{}}
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
            editable: true,
          },
          {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
            editable: true,
          },
          {
            title: '住址',
            dataIndex: 'address',
            key: 'address',
            editable: true,
          },
        ]}
      />
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </>
  );
};

export default DemoPage;
