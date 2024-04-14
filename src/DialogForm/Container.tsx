import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Drawer, Modal } from 'antd';
import { DrawerProps } from 'antd/es/drawer';
import { ModalProps } from 'antd/es/modal';

export type ContainerProps =
  | ({
      type: 'modal';
    } & ModalProps)
  | ({
      type: 'drawer';
    } & DrawerProps & {
        footer?: React.ReactNode;
      });

const Container = (props: React.PropsWithChildren<ContainerProps>) => {
  if (props.type === 'modal') {
    const { type, ...modalProps } = props;
    return <Modal {...modalProps}></Modal>;
  }

  if (props.type === 'drawer') {
    const { type, ...drawerProps } = props;
    return <Drawer {...drawerProps}></Drawer>;
  }

  return null;
};

export default Container;
