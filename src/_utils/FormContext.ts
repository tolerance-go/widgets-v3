import { WrappedFormUtils } from 'antd/es/form/Form';
import { createContext } from 'react';
import { EventBus } from './EventBus';

// 直接创建一个 Context 来传递 form 实例，不需要额外的标志
export const FormContext = createContext<WrappedFormUtils | null>(null);

export const FormParentsFieldIdContext = createContext<string>('');

export const FormEventBusContext = createContext<EventBus | null>(null);
