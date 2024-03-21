import { Button, Cascader, Form, Icon, Input, Row, Tooltip, Typography } from 'antd';
import React from 'react';
import { FrontendFilteredSelect, ModalForm, FrontendFilteredSelectListItem } from 'widgets-v3';
import delay from 'delay';

export default () => (
  <Row>
    <FrontendFilteredSelect
      placeholder="请选择"
      request={async () => {
        await delay(1000);
        throw new Error('异常错误');
      }}
    />
    <FrontendFilteredSelect
      placeholder="请选择"
      request={async () => {
        await delay(1000);
        throw '异常错误';
      }}
    />
    <Typography.Paragraph>默认异常文案</Typography.Paragraph>
    <FrontendFilteredSelect
      placeholder="请选择"
      request={async () => {
        await delay(1000);
        throw Error();
      }}
    />
    <FrontendFilteredSelect
      placeholder="请选择"
      request={async () => {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('请求异常'));
          }, 1000);
        });
        return [];
      }}
    />
  </Row>
);
