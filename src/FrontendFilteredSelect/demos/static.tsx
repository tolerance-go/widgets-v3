import { Button, Cascader, Form, Icon, Input, Row, Tooltip } from 'antd';
import React from 'react';
import { FrontendFilteredSelect, ModalForm, FrontendFilteredSelectListItem } from 'widgets-v3';

export default () => (
  <Row>
    <FrontendFilteredSelect
      placeholder="请选择"
      onChange={(value) => {
        console.log(typeof value);
      }}
      valueEnum={{
        open: '未解决',
        closed: '已解决',
      }}
    />

    <FrontendFilteredSelect
      placeholder="请选择"
      onChange={(value) => {
        console.log(typeof value);
      }}
      valueEnum={
        new Map([
          [-1, '未解决'],
          [0, '已解决'],
        ])
      }
    />
  </Row>
);
