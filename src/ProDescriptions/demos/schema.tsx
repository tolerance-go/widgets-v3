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
      return {
        type: 'Tabs',
        props: {},
        children: [
          {
            type: 'TabPane',
            props: { tab: 'Tab 1' },
            children: [
              {
                type: 'Card',
                props: { title: 'Card Title 1' },
                children: [
                  {
                    type: 'Descriptions',
                    props: { title: 'User Info 1' },
                    children: [
                      { type: 'DescriptionsItem', props: { label: 'Name', children: 'John Doe' } },
                      { type: 'DescriptionsItem', props: { label: 'Age', children: '30' } },
                      { type: 'DescriptionsItem', props: { label: 'Country', children: 'USA' } },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'TabPane',
            props: { tab: 'Tab 2' },
            children: [
              {
                type: 'Card',
                props: { title: 'Card Title 2' },
                children: [
                  {
                    type: 'Descriptions',
                    props: { title: 'User Info 2' },
                    children: [
                      { type: 'DescriptionsItem', props: { label: 'Name', children: 'Jane Doe' } },
                      { type: 'DescriptionsItem', props: { label: 'Age', children: '28' } },
                      { type: 'DescriptionsItem', props: { label: 'Country', children: 'Canada' } },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };
    }}
  </ProDescriptions>
);