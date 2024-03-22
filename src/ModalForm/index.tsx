import React, { forwardRef } from 'react';
import DialogForm, { DialogFormBaseProps } from '../DialogForm';

const ModalForm = (props: DialogFormBaseProps) => {
  return <DialogForm {...props} type="modal" />;
};

export default ModalForm;
