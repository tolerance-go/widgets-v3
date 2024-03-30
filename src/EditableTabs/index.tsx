import React, { useEffect, useState, forwardRef } from 'react';
import { Icon, Tabs, Button, Popconfirm, Form, Input } from 'antd';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  DraggableAttributes,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import ModalForm from '../ModalForm';

const { TabPane } = Tabs;

interface Item {
  key: string;
  label?: string;
}

export interface EditableTabsProps {
  value?: Item[];
  onChange?: (items: Item[]) => void;
  initialItems?: Item[];
  renderTabPane?: (args: { item: Item }) => React.ReactNode;
  getAddedItem?: (args: { newItem: Item }) => Item;
}

interface DraggableTabPaneProps {
  key?: string;
  children?: React.ReactNode;
  label?: string;
  dataNodeKey: string;
  onRemove: (key: string) => void;
  onEdit: (key: string, newLabel: string) => void;
}

interface DragHandleProps {
  listeners?: SyntheticListenerMap;
  attributes: DraggableAttributes;
}

const DragHandle = forwardRef<HTMLSpanElement, DragHandleProps>((props, ref) => (
  <span ref={ref} onClick={(e) => e.stopPropagation()} {...props.listeners} {...props.attributes}>
    <Icon type="menu" style={{ fontSize: '15px', marginRight: 24, cursor: 'grab' }} />
  </span>
));

interface RemoveIconProps {
  onRemove: () => void;
}

const RemoveIcon: React.FC<RemoveIconProps> = ({ onRemove }) => (
  <Popconfirm
    title="确定要删除这个标签页吗？"
    onConfirm={(e) => {
      e.stopPropagation();
      onRemove();
    }}
    onCancel={(e) => e.stopPropagation()}
    okText="确定"
    cancelText="取消"
  >
    <Icon
      type="close"
      style={{ cursor: 'pointer', marginLeft: 14 }}
      onClick={(e) => e.stopPropagation()}
    />
  </Popconfirm>
);

const EditIcon: React.FC<{ currentLabel?: string; onEdit?: (label: string) => void }> = ({
  onEdit,
  currentLabel,
}) => (
  <ModalForm
    title="编辑标签"
    stopWrapClickPropagation
    trigger={
      <Icon
        type="edit"
        style={{ cursor: 'pointer', marginLeft: 24 }}
        onClick={(e) => e.stopPropagation()}
      />
    }
    renderActionGroup={({ form, toggleModal }) => {
      return (
        <Button
          type="primary"
          onClick={(e) => {
            onEdit?.(form.getFieldValue('label'));
            toggleModal();
          }}
        >
          确认
        </Button>
      );
    }}
    renderFormItems={({ form }) => {
      return (
        <>
          <Form.Item label="原标签">{currentLabel}</Form.Item>
          <Form.Item label="修改后">
            {form.getFieldDecorator('label', {
              initialValue: currentLabel,
            })(<Input autoFocus></Input>)}
          </Form.Item>
        </>
      );
    }}
  ></ModalForm>
);

const DraggableTabNode: React.FC<DraggableTabPaneProps> = ({
  children,
  dataNodeKey,
  label,
  onRemove,
  onEdit,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: dataNodeKey,
  });

  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    // scaleX 解决拖拽的时候变形的问题
    transform: CSS.Transform.toString(transform && { ...transform, scaleX: 1 }),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <DragHandle listeners={listeners} attributes={attributes} />
      <div>{label}</div>
      <EditIcon currentLabel={label} onEdit={(newLabel) => onEdit(dataNodeKey, newLabel)} />
      <RemoveIcon onRemove={() => onRemove(dataNodeKey)} />
    </div>
  );
};

const EditableTabs: React.FC<EditableTabsProps> = ({
  value,
  onChange,
  initialItems = [],
  renderTabPane,
  getAddedItem,
}) => {
  const [items, setItems] = useState<Item[]>(initialItems);

  const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } });

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const activeIndex = prev.findIndex((i) => i.key === active.id);
        const overIndex = prev.findIndex((i) => i.key === over.id);
        const newArray = arrayMove(prev, activeIndex, overIndex);
        onChange?.(newArray);
        return newArray;
      });
    }
  };

  const handleEdit = (keyToEdit: string, newLabel: string) => {
    const newItems = items.map((item) => {
      if (item.key === keyToEdit) {
        return { ...item, label: newLabel };
      }
      return item;
    });
    setItems(newItems);
    onChange?.(newItems);
  };

  const handleRemove = (keyToRemove: string) => {
    const newItems = items.filter((item) => item.key !== keyToRemove);
    setItems(newItems);
    onChange?.(newItems);
  };

  const handleAdd = () => {
    const newItem: Item = {
      key: Math.random() + '',
      label: `标签 ${items.length + 1}`,
    };
    const newItems = [...items, getAddedItem?.({ newItem }) ?? newItem];
    setItems(newItems);
    onChange?.(newItems);
  };

  return (
    <>
      <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
        <SortableContext items={items.map((i) => i.key)} strategy={horizontalListSortingStrategy}>
          <Tabs
            tabBarExtraContent={
              <Button type="dashed" onClick={handleAdd}>
                新增一页
              </Button>
            }
          >
            {items.map((item) => (
              <TabPane
                tab={
                  <DraggableTabNode
                    dataNodeKey={item.key}
                    label={item.label}
                    onRemove={handleRemove}
                    onEdit={handleEdit} // 这里传递 onEdit 函数
                  />
                }
                key={item.key}
              >
                {renderTabPane?.({ item })}
              </TabPane>
            ))}
          </Tabs>
        </SortableContext>
      </DndContext>
    </>
  );
};

export default EditableTabs;
