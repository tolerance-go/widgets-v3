import { Button, Cascader, Form, Col, Icon, Input, Row, Tooltip, Modal } from 'antd';
import React from 'react';
import { Action } from 'widgets-v3';
import delay from 'delay';

export default () => (
  <Row gutter={10} type="flex">
    <Col>
      <Action
        trigger={({ loading }) =>
          loading ? <Icon type="loading" style={{ color: '#1890ff' }} /> : <a>按钮</a>
        }
        request={async () => {
          await delay(1000);
        }}
      />
    </Col>
  </Row>
);
