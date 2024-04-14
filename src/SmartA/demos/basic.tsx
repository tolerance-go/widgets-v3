import { Button, Cascader, Form, Col, Icon, Input, Row, Tooltip, Modal } from 'antd';
import React from 'react';
import { Action, SmartA } from 'widgets-v3';
import delay from 'delay';

export default () => (
  <Row gutter={10} type="flex">
    <Col>
      <Action
        trigger={
          <SmartA
            onClick={() => {
              console.log('click');
            }}
          >
            按钮
          </SmartA>
        }
        request={async () => {
          await delay(1000);
        }}
      />
    </Col>
    <Col>
      <SmartA
        disabled
        onClick={() => {
          console.log('click');
        }}
      >
        按钮
      </SmartA>
    </Col>
  </Row>
);
