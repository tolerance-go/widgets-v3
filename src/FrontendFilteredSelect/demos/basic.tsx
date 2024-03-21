import { Button, Cascader, Form, Icon, Input, Row, Tooltip } from 'antd';
import React from 'react';
import { FrontendFilteredSelect, ModalForm, FrontendFilteredSelectListItem } from 'widgets-v3';
import delay from 'delay';

const generateChildren = (total: number): FrontendFilteredSelectListItem[] => {
  const children: FrontendFilteredSelectListItem[] = [];
  for (let i = 0; i < total; i++) {
    children.push({
      value: 'value-' + i,
      label: 'label-' + i,
    });
  }
  return children;
};

const getPageItems = (
  page: number,
  pageSize: number,
  total: number,
): FrontendFilteredSelectListItem[] => {
  const children = generateChildren(total);
  // 计算开始索引和结束索引
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  // 返回当前页的数组子集
  return children.slice(startIndex, endIndex);
};

export default () => (
  <Row>
    <FrontendFilteredSelect
      placeholder="请选择"
      request={async () => {
        await delay(1000);
        return getPageItems(1, 100, 100);
      }}
    />
  </Row>
);
