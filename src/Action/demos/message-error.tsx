import { Button, Cascader, Form, Col, Icon, Input, Row, Tooltip } from 'antd';
import React from 'react';
import { Action } from 'widgets-v3';
import delay from 'delay';

export default () => (
  <Row gutter={10} type="flex">
    <Col>
      <Action
        trigger={<Button type="primary">请求异常按钮</Button>}
        request={async () => {
          await delay(1000);
          throw new Error('自定义错误信息');
        }}
      />
    </Col>

    <Col>
      <Action
        trigger={<Button type="primary">请求异常按钮</Button>}
        request={async () => {
          await delay(1000);
          throw '自定义错误信息';
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
        trigger={<Button type="primary">Promise 内的异常</Button>}
        request={async () => {
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              reject(new Error('表单验证失败'));
            }, 1000);
          });
        }}
      />
    </Col>
  </Row>
);
