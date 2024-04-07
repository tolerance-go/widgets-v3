import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { Button, Icon } from 'antd';
import React, { forwardRef, useState } from 'react';
import { EditableGroups, EditableGroupsProps } from 'widgets-v3';

interface DragHandleProps {
  listeners?: SyntheticListenerMap;
  attributes: DraggableAttributes;
}

const DragHandle = forwardRef<HTMLSpanElement, DragHandleProps>((props, ref) => (
  <span ref={ref} onClick={(e) => e.stopPropagation()} {...props.listeners} {...props.attributes}>
    <Icon type="menu" style={{ fontSize: '15px', cursor: 'grab' }} />
  </span>
));

// 创建演示页面组件
const DemoPage = () => {
  const [value, onChange] = useState<EditableGroupsProps['value']>();
  return (
    <>
      <EditableGroups
        value={value}
        onChange={onChange}
        initialItems={[
          {
            key: '1',
            data: 'item1',
          },
          {
            key: '2',
            data: 'item2',
          },
        ]}
        renderGroupItem={({ item, methods, listeners, attributes, index }) => {
          return (
            <div
              style={{
                padding: 20,
                border: '1px solid',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <DragHandle listeners={listeners} attributes={attributes} />
              <div>{JSON.stringify(item)}</div>
              <Button type="primary" onClick={() => methods.addItem({ key: Math.random() + '' })}>
                新增 {item.key}
              </Button>
              <Button
                icon="plus"
                onClick={() => methods.addItem({ key: Math.random() + '', data: 'new item' })}
              >
                新增
              </Button>
              <Button icon="delete" onClick={() => methods.deleteItem(index)}>
                删除
              </Button>
              <Button
                icon="down"
                onClick={() =>
                  methods.insertItem(index + 1, { key: Math.random() + '', data: 'inserted item' })
                }
              >
                插入
              </Button>
            </div>
          );
        }}
      />
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </>
  );
};

export default DemoPage;
