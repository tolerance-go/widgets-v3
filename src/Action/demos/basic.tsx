import { Button, Cascader, Form, Col, Icon, Input, Row, Tooltip } from 'antd';
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
        trigger={<Button type="primary">请求异常按钮</Button>}
        request={async () => {
          await delay(1000);
          throw new Error();
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
  </Row>
);
