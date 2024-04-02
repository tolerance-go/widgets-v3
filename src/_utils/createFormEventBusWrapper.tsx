import { RcBaseFormProps } from 'antd/es/form/Form';
import { ConnectedComponentClass } from 'antd/es/form/interface';
import React, { FC, useContext, useRef } from 'react';
import { createEventBus } from './EventBus';
import { FormEventBusContext } from './FormContext';

export const createFormEventBusWrapper =
  <
    P extends {
      onValuesChange?: (changedValues: Record<string, any>, allValues: Record<string, any>) => void;
    },
  >(
    FormComponent: ConnectedComponentClass<FC<P>, Omit<P, 'form'>>,
  ) =>
  (props: Omit<P, 'form'> & RcBaseFormProps) => {
    const eventBusRef = useRef(createEventBus());
    const existingFormEventBus = useContext(FormEventBusContext);

    const formComponent = (
      <FormComponent
        {...props}
        onValuesChange={(changedValues, allValues) => {
          eventBusRef.current.emit('onValuesChange', changedValues, allValues);
          props.onValuesChange?.(changedValues, allValues);
        }}
      />
    );

    if (existingFormEventBus) {
      return formComponent;
    }

    return (
      <FormEventBusContext.Provider value={eventBusRef.current}>
        {formComponent}
      </FormEventBusContext.Provider>
    );
  };
