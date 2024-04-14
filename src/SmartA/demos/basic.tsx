import { Button, Cascader, Form, Col, Icon, Input, Row, Tooltip, Modal } from 'antd';
import React from 'react';
import { Action, SmartA } from 'widgets-v3';
import delay from 'delay';

export default () => (
  <>
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
    <SmartA
      disabled
      onClick={() => {
        console.log('click');
      }}
    >
      按钮
    </SmartA>
    其他的文本
  </>
);
