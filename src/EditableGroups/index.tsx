import {
  DndContext,
  DraggableAttributes,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { ForwardedRef, forwardRef, useImperativeHandle, useState } from 'react';

interface SortableItemProps<T extends Record<string, any> = Record<string, any>> {
  id: string;
  index: number;
  item: T;
  methods: EditableGroupsMethods<T>;
  renderGroupItem?: (args: {
    index: number;
    item: T;
    methods: EditableGroupsMethods<T>;
    listeners?: SyntheticListenerMap;
    attributes: DraggableAttributes;
  }) => React.ReactNode;
}

function SortableItem<T extends Record<string, any> = Record<string, any>>({
  id,
  index,
  item,
  methods,
  renderGroupItem,
}: SortableItemProps<T>) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style}>
      {renderGroupItem?.({
        index,
        item,
        methods,
        listeners,
        attributes,
      })}
    </div>
  );
}

// 使用泛型T来定义props，使得item可以是任意类型
export type EditableGroupsProps<T extends Record<string, any> = Record<string, any>> = {
  value?: T[];
  initialItems?: T[];
  onChange?: (items: T[]) => void;
  renderGroupItem?: (args: {
    index: number;
    item: T;
    methods: EditableGroupsMethods<T>;
    listeners?: SyntheticListenerMap;
    attributes: DraggableAttributes;
  }) => React.ReactNode;
  rowKey?: keyof T;
};

export type EditableGroupsMethods<T> = {
  addItem: (item: T) => void;
  deleteItem: (index: number) => void;
  insertItem: (index: number, item: T) => void;
  getItem: (index: number) => T | undefined;
  moveItem: (from: number, to: number) => void;
};

const EditableGroups = <T extends Record<string, any> = Record<string, any>>(
  {
    value,
    onChange,
    initialItems = [],
    renderGroupItem,
    rowKey = 'key' as keyof T,
  }: EditableGroupsProps<T>,
  ref: ForwardedRef<EditableGroupsMethods<T>>,
) => {
  const [items, setItems] = useState<T[]>(value ?? initialItems);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const methods: EditableGroupsMethods<T> = {
    addItem: (item) => {
      const nextItems = [...items, item];
      setItems(nextItems);
      onChange?.(nextItems);
    },
    deleteItem: (index) => {
      const nextItems = items.filter((_, i) => i !== index);
      setItems(nextItems);
      onChange?.(nextItems);
    },
    insertItem: (index, item) => {
      const nextItems = [...items.slice(0, index), item, ...items.slice(index)];
      setItems(nextItems);
      onChange?.(nextItems);
    },
    getItem: (index) => {
      return items[index];
    },
    moveItem: (from, to) => {
      const nextItems = arrayMove(items, from, to);
      setItems(nextItems);
      onChange?.(nextItems);
    },
  };

  // 使用 useImperativeHandle 来暴露组件方法
  useImperativeHandle(ref, () => ({
    // 你可以在这里暴露任何内部方法，例如：
    addItem: methods.addItem,
    deleteItem: methods.deleteItem,
    insertItem: methods.insertItem,
    getItem: methods.getItem,
    moveItem: methods.moveItem,
    // 可以根据需要添加更多方法
  }));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
          const oldIndex = items.findIndex((item) => `${item[rowKey]}` === active.id);
          const newIndex = items.findIndex((item) => `${item[rowKey]}` === over.id);
          if (oldIndex !== -1 && newIndex !== -1) {
            methods.moveItem(oldIndex, newIndex);
            // 注意：onChange 在 moveItem 方法中已经被调用
          }
        }
      }}
    >
      <SortableContext items={items.map((item) => `${item[rowKey]}`)}>
        <div>
          {items.map((item, index) => (
            <SortableItem<T>
              key={`${item[rowKey]}`}
              id={`${item[rowKey]}`}
              index={index}
              item={item}
              methods={methods}
              renderGroupItem={renderGroupItem}
            ></SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default forwardRef(EditableGroups) as <T extends Record<string, any> = Record<string, any>>(
  props: EditableGroupsProps<T> & { ref?: ForwardedRef<EditableGroupsMethods<T>> },
) => JSX.Element;
