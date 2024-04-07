import React, { useContext, useEffect, useState } from 'react';
import { FormContext, FormEventBusContext } from '../_utils/FormContext';

export type FormDependencyProps = {
  children?: (depends: Record<string, any>) => React.ReactNode;
};

const FormDependency = ({ children }: FormDependencyProps) => {
  const form = useContext(FormContext);
  const formEventBus = useContext(FormEventBusContext);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  useEffect(() => {
    setFormValues(form?.getFieldsValue() ?? {});
  }, [form]);

  useEffect(() => {
    if (!formEventBus) return;

    /**
     * 目前的策略是 Form 融合嵌套，Form 自身不作为一个单独的 FormField，而只要在表单字段触发修改的时候
     * 才导致 form 改变，而类似 TabsForm 的布局改变的时候，需要通过事件方式通知
     */
    const handler = formEventBus.on('onTabsFormTabItemsChange', () => {
      setFormValues(form?.getFieldsValue() ?? {});
    });

    return () => {
      formEventBus.off('onTabsFormTabItemsChange', handler);
    };
  }, []);

  return <>{children?.(formValues)}</>;
};

export default FormDependency;
