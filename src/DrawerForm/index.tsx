import React from 'react';
import DialogForm, { DialogFormBaseProps } from '../DialogForm';

const DrawerForm = (props: DialogFormBaseProps) => {
  return <DialogForm width={'40%'} {...props} type="drawer" />;
};

export default DrawerForm;
