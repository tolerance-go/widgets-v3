import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Drawer, Modal } from 'antd';
import { DrawerProps } from 'antd/es/drawer';
import { ModalProps } from 'antd/es/modal';
import './Container.less';

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
    const { type, footer, children, ...drawerProps } = props;
    return (
      <Drawer {...drawerProps}>
        {children}
        {footer && (
          <div
            className="widgets-v3_dialog-form_footer"
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            {footer}
          </div>
        )}
      </Drawer>
    );
  }

  return null;
};

export default Container;
