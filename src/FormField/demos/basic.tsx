import { Button, Col, Form, Input, Row } from 'antd';
import delay from 'delay';
import React from 'react';
import { FormField, ProForm } from 'widgets-v3';

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
          <Form.Item label="fieldA">
            {getFieldDecorator('fieldA', {
              rules: [
                {
                  message: 'Please input your E-mail!',
                },
              ],
            })(
              <FormField>
                {({ editing, onChange, value, startEditing, stopEditing }) => {
                  if (editing) {
                    return (
                      <Row>
                        <Col>
                          <Input onChange={onChange} value={value} />
                        </Col>
                        <Col>
                          <Button
                            type="primary"
                            onClick={() => {
                              stopEditing();
                            }}
                          >
                            结束编辑
                          </Button>
                        </Col>
                      </Row>
                    );
                  }
                  return (
                    <Row>
                      <Col>
                        <div>{value}</div>
                      </Col>
                      <Col>
                        <Button
                          type="primary"
                          onClick={() => {
                            startEditing();
                          }}
                        >
                          编辑
                        </Button>
                      </Col>
                    </Row>
                  );
                }}
              </FormField>,
            )}
          </Form.Item>
          <Form.Item label="fieldA">
            {getFieldDecorator('fieldA', {
              rules: [
                {
                  message: 'Please input your E-mail!',
                },
              ],
            })(<Input />)}
          </Form.Item>
        </>
      );
    }}
  />
);
