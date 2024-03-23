import { Button, Cascader, Form, Icon, Input, Tooltip } from 'antd';
import delay from 'delay';
import React from 'react';
import { ProDescriptions } from 'widgets-v3';

export default () => (
  <>
    <ProDescriptions
      request={async () => {
        await delay(1000);
        return {
          email: 'yarnb@qq.com',
          password: 123,
          nickname: 'yarnb',
        };
      }}
    >
      {(data) => {
        return <div>{JSON.stringify(data)}</div>;
      }}
    </ProDescriptions>

    <ProDescriptions
      request={async () => {
        await delay(1000);
        return {
          email: 'yarnb@qq.com',
          password: 123,
          nickname: 'yarnb',
        };
      }}
    >
      {(data) => {
        return [<div key={1}>{JSON.stringify(data)}</div>, <div key={2}>{JSON.stringify(data)}</div>];
      }}
    </ProDescriptions>
  </>
);
