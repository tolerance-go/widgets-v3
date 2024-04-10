import { Button, Cascader, Form, Col, Icon, Input, Row, Tooltip, Modal } from 'antd';
import React from 'react';
import { Action } from 'widgets-v3';
import delay from 'delay';

export default () => (
  <Row gutter={10} type="flex">
    <Col>
      <Action
        trigger={<Button type="primary">按钮</Button>}
        request={async () => {
          await delay(1000);
        }}
      />
    </Col>
    <Col>
      <Action
        trigger={
          <Button
            type="primary"
            onClick={() => {
              alert('onClick 自己也可以控制');
            }}
          >
            自定义按钮
          </Button>
        }
        request={async () => {
          await delay(1000);
        }}
      />
    </Col>

    <Col>
      <Button
        type="primary"
        onClick={() => {
          Modal.confirm({
            title: '确认？',
            content: '描述',
            onOk: async () => {
              await delay(1000);
            },
          });
        }}
      >
        弹窗确认按钮
      </Button>
    </Col>
  </Row>
);
