import { Button, Modal } from 'antd';
import React from 'react';
import { Action, confirm } from 'widgets-v3';
import delay from 'delay';

export default () => (
  <>
    <Button
      onClick={() => {
        confirm({
          title: '审核?',
          content: '确认审核嘛？',
          // maskClosable: true,
          actions: ({ methods }) => [
            <Action
              request={async () => {
                await delay(1000);
                methods.cancel();
              }}
              trigger={<Button type="danger">驳回</Button>}
            />,
            <Action
              request={async () => {
                await delay(1000);
                methods.cancel();
              }}
              trigger={<Button type="primary">审核</Button>}
            />,
            <Action
              request={async () => {
                await delay(1000);
                methods.cancel();
              }}
              trigger={<Button type="primary">其他</Button>}
            />,
          ],
        });
      }}
    >
      弹出确认框
    </Button>

    <Button
      style={{ marginLeft: 8 }}
      onClick={() => {
        confirm({
          title: '审核?',
          content: '确认审核嘛？',
          okText: '审核',
          cancelText: '驳回',
          cancelButtonProps: {
            type: 'danger',
          },
          maskClosable: true,
          onOk: async () => {
            await delay(1000);
          },
          onCancel: async () => {
            alert(1);
            await delay(1000);
          },
        });
      }}
    >
      弹出确认框
    </Button>

    <Button
      style={{ marginLeft: 8 }}
      onClick={() => {
        Modal.confirm({
          title: '审核?',
          content: '确认审核嘛？',
          okText: '审核',
          cancelText: '驳回',
          cancelButtonProps: {
            type: 'danger',
          },
        });
      }}
    >
      弹出确认框(antd)
    </Button>

    <Button
      style={{ marginLeft: 8 }}
      onClick={() => {
        Modal.confirm({
          title: '审核?',
          content: '确认审核嘛？',
          okText: '审核',
          cancelText: '驳回',
          cancelButtonProps: {
            type: 'danger',
          },
          maskClosable: true,
          onOk: async () => {
            await delay(1000);
          },
          onCancel: async () => {
            alert(1);
            await delay(1000);
          },
        });
      }}
    >
      弹出确认框(antd)
    </Button>
  </>
);
