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
