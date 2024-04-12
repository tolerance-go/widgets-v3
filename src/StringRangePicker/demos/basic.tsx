import { Button, Form } from 'antd';
import delay from 'delay';
import React from 'react';
import { BackendFilteredSelect, ProForm, StringRangePicker } from 'widgets-v3';

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
          <Form.Item label="StringRangePicker">
            {getFieldDecorator('StringRangePicker', {
              rules: [],
            })(<StringRangePicker />)}
          </Form.Item>

          <Form.Item label="StringRangePicker YYYY-MM-DD HH:mm:ss">
            {getFieldDecorator('StringRangePicker YYYY-MM-DD HH:mm:ss', {
              rules: [],
              initialValue: ['2024-04-15 03:30:07', '2024-05-18 03:30:07'],
            })(<StringRangePicker valueFormat="YYYY-MM-DD HH:mm:ss" format={'YYYY-MM-DD'} />)}
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
