import { Button, Cascader, Form, Icon, Input, Row, Tooltip } from 'antd';
import React from 'react';
import { BackendFilteredSelect, ModalForm } from 'widgets-v3';
import delay from 'delay';
import { BackendFilteredSelectListItem } from '..';

const PAGE_SIZE = 50;

const generateChildren = (total: number = 100): BackendFilteredSelectListItem[] => {
  const children: BackendFilteredSelectListItem[] = [];
  for (let i = 0; i < total; i++) {
    children.push({
      value: i.toString() + i,
      label: i.toString() + i,
    });
  }
  return children;
};

const getPageItems = (
  page: number,
  pageSize: number = PAGE_SIZE,
): BackendFilteredSelectListItem[] => {
  const children = generateChildren();
  // 计算开始索引和结束索引
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  // 返回当前页的数组子集
  return children.slice(startIndex, endIndex);
};

export default () => (
  <Row>
    <BackendFilteredSelect
      pageSize={PAGE_SIZE}
      placeholder="请选择"
      request={async (params) => {
        console.log('发出请求', params);
        await delay(1000);
        return {
          list: getPageItems(params.current, params.pageSize),
          total: 100,
        };
      }}
    />
  </Row>
);
