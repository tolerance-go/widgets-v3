import { Button, Cascader, Form, Icon, Input, Tooltip } from 'antd';
import React from 'react';
import { DrawerForm, FullscreenImage, SmartDescriptions, SearchTable } from 'widgets-v3';
import delay from 'delay';
import img1 from './img1.webp';

export default () => (
  <FullscreenImage trigger={<Icon type="picture" />} style={{ width: 100 }} src={img1} />
);
