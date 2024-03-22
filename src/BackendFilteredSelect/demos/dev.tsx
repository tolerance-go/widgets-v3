/**
 * debug: true
 */
import { Button, Cascader, Form, Icon, Input, Row, Tooltip, Typography } from 'antd';
import React from 'react';
import { BackendFilteredSelect, ModalForm, BackendFilteredSelectListItem } from 'widgets-v3';
import delay from 'delay';

const generateChildren = (total: number): BackendFilteredSelectListItem[] => {
  const children: BackendFilteredSelectListItem[] = [];
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
): BackendFilteredSelectListItem[] => {
  const children = generateChildren(total);
  // 计算开始索引和结束索引
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  // 返回当前页的数组子集
  return children.slice(startIndex, endIndex);
};

export default () => (
  <Row>
    <Typography.Title level={4}>搜索后，只显示 loading，不展示 menu</Typography.Title>
    <BackendFilteredSelect
      pageSize={50}
      placeholder="请选择"
      request={async (params) => {
        console.log('发出请求', params);
        await delay(1000);
        return {
          list: getPageItems(params.current, params.pageSize, 100),
          total: 100,
        };
      }}
    />
    <Typography.Title level={4}>
      如果只有第一页数据，就显示完了，不展示“没有更多了”
    </Typography.Title>
    <BackendFilteredSelect
      pageSize={50}
      placeholder="请选择"
      request={async (params) => {
        console.log('发出请求', params);
        await delay(1000);
        return {
          list: getPageItems(params.current, params.pageSize, 50),
          total: 50,
        };
      }}
    />
  </Row>
);
