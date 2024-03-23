import { Button, Cascader, Form, Icon, Input, Tooltip } from 'antd';
import delay from 'delay';
import React from 'react';
import { ProDescriptions } from 'widgets-v3';

export default () => (
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
      return [
        {
          type: 'Tabs',
          props: {},
          children: [
            {
              type: 'TabPane',
              props: { tab: '选项卡 1' },
              children: [
                {
                  type: 'Card',
                  props: { title: '卡片标题 1' },
                  children: [
                    {
                      type: 'Descriptions',
                      props: { title: '用户信息 1' },
                      children: [
                        {
                          type: 'DescriptionsItem',
                          props: { label: '姓名', children: data?.nickname },
                        },
                        { type: 'DescriptionsItem', props: { label: '年龄', children: '30' } },
                        { type: 'DescriptionsItem', props: { label: '国家', children: '美国' } },
                      ],
                    },
                  ],
                },
                {
                  type: 'Card',
                  props: { title: '卡片标题 2' },
                  children: [
                    {
                      type: 'Descriptions',
                      props: { title: '用户信息 2' },
                      children: [
                        { type: 'DescriptionsItem', props: { label: '姓名', children: '简·多' } },
                        { type: 'DescriptionsItem', props: { label: '年龄', children: '28' } },
                        { type: 'DescriptionsItem', props: { label: '国家', children: '加拿大' } },
                      ],
                    },
                    {
                      type: 'Table',
                      props: {
                        columns: [
                          { title: '属性', dataIndex: 'attribute', key: 'attribute' },
                          { title: '值', dataIndex: 'value', key: 'value' },
                        ],
                        dataSource: [
                          { key: '1', attribute: '爱好', value: '阅读' },
                          { key: '2', attribute: '最爱颜色', value: '蓝色' },
                          { key: '3', attribute: '梦想之城', value: '东京' },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'TabPane',
              props: { tab: '选项卡 2' },
              children: [
                {
                  type: 'Card',
                  props: { title: '卡片标题 2' },
                  children: [
                    {
                      type: 'Descriptions',
                      props: { title: '用户信息 2' },
                      children: [
                        {
                          type: 'DescriptionsItem',
                          props: { key: '姓名', label: '姓名', children: '简·多' },
                        },
                        {
                          type: 'DescriptionsItem',
                          props: { key: '年龄', label: '年龄', children: '28' },
                        },
                        {
                          type: 'DescriptionsItem',
                          props: { key: '国家', label: '国家', children: '加拿大' },
                        },
                      ],
                    },
                    {
                      type: 'Table',
                      props: {
                        columns: [
                          { title: '属性', dataIndex: 'attribute', key: 'attribute' },
                          { title: '值', dataIndex: 'value', key: 'value' },
                        ],
                        dataSource: [
                          { key: '1', attribute: '爱好', value: '阅读' },
                          { key: '2', attribute: '最爱颜色', value: '蓝色' },
                          { key: '3', attribute: '梦想之城', value: '东京' },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];
    }}
  </ProDescriptions>
);
