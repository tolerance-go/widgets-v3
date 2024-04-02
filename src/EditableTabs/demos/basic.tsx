import React, { useState } from 'react';
import { EditableTabs, EditableTabsProps } from 'widgets-v3';

// 创建演示页面组件
const DemoPage = () => {
  const [value, onChange] = useState<EditableTabsProps['value']>();
  return (
    <>
      <EditableTabs
        value={value}
        onChange={onChange}
        getAddedItem={({ newItem }) => {
          return {
            ...newItem,
            label: Math.random() + '',
          };
        }}
        initialItems={[
          {
            key: '1',
            label: 'tab1',
          },
          {
            key: '2',
            label: 'tab2',
          },
        ]}
        renderTabPane={({ item }) => {
          return item.key;
        }}
      />
      {JSON.stringify(value)}
    </>
  );
};

export default DemoPage;
