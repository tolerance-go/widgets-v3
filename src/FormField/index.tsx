import React, { useContext, useState } from 'react';
import { FormContext } from 'src/_utils/FormContext';

// 定义传递给 children 函数的参数类型
interface ChildrenProps<T> {
  onChange?: (value: T) => void;
  value?: T;
  startEditing: () => void; // 添加一个方法来开始编辑
  stopEditing: () => void; // 添加一个方法来开始编辑
  editing: boolean;
}

// FormField 组件的 Props 类型，使用泛型 T 来表示 value 的类型
interface FormFieldProps<T> {
  children?: (props: ChildrenProps<T>) => React.ReactNode;
  initialEditing?: boolean;
  value?: T;
  onChange?: (value: T) => void;
}

// FormField 组件定义，使用泛型 T
const FormField = <T extends any = any>({
  children,
  initialEditing,
  value,
  onChange,
}: FormFieldProps<T>) => {
  const form = useContext(FormContext);
  const [editing, setEditing] = useState(() => initialEditing ?? !!form); // 使用 useState 管理编辑状态

  // 开始编辑的方法
  const startEditing = () => setEditing(true);
  // 结束编辑的方法
  const stopEditing = () => setEditing(false);

  return <>{children?.({ editing, startEditing, stopEditing, value, onChange })}</>;
};

export default FormField;
