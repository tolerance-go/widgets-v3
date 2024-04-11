// ProConfirm.tsx
import { Button, Col, Modal, Row } from 'antd';
import { ModalFuncProps } from 'antd/es/modal/Modal';
import React, { ReactNode, useState } from 'react';
import ReactDOM from 'react-dom';

type ShowProConfirmConfigs = Pick<
  ModalFuncProps,
  'title' | 'content' | 'onOk' | 'onCancel' | 'content'
> & {
  actions?: (args: { methods: ProConfirmMethods }) => ReactNode[];
};

type ProConfirmProps = ShowProConfirmConfigs & {
  onClose: () => void; // 添加一个onClose函数prop
};

type ProConfirmMethods = {
  close: () => void;
};

const ProConfirm = (props: ProConfirmProps) => {
  const { title, content, actions, onOk, onCancel, onClose } = props;
  const [visible, setVisible] = useState(true);
  const [loadingOk, setLoadingOk] = useState(false); // State to track loading for confirm
  const [loadingCancel, setLoadingCancel] = useState(false); // State to track loading for cancel

  // Handle confirm action
  const handleConfirm = () => {
    const promise = onOk?.();
    if (promise instanceof Promise) {
      setLoadingOk(true);
      promise
        .then(() => {
          setVisible(false);
        })
        .catch((e) => {
          console.error('Confirm Promise rejected:', e);
        })
        .finally(() => {
          setLoadingOk(false);
        });
    } else {
      setVisible(false);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    const promise = onCancel?.();
    if (promise instanceof Promise) {
      setLoadingCancel(true);
      promise
        .then(() => {
          setVisible(false);
        })
        .catch((e) => {
          console.error('Cancel Promise rejected:', e);
        })
        .finally(() => {
          setLoadingCancel(false);
        });
    } else {
      setVisible(false);
    }
  };

  const methods: ProConfirmMethods = {
    close: () => {
      setVisible(false);
    },
  };

  // 默认操作按钮
  const footer = actions?.({ methods }) || [
    <Button key="back" onClick={handleCancel} loading={loadingCancel}>
      取消
    </Button>,
    <Button key="submit" type="primary" onClick={handleConfirm} loading={loadingOk}>
      确认
    </Button>,
  ];

  return (
    <Modal
      title={null}
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      afterClose={() => {
        onClose();
      }}
      width={416}
      bodyStyle={{
        padding: '32px 32px 24px',
      }}
      maskClosable={false}
    >
      {title && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <i
            style={{
              marginRight: '16px',
              fontSize: '22px',
              color: '#faad14',
            }}
            aria-label="icon: question-circle"
            className="anticon anticon-question-circle"
          >
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="question-circle"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
              <path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0 1 30.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"></path>
            </svg>
          </i>
          <span
            style={{
              overflow: 'hidden',
              color: 'rgba(0, 0, 0, .85)',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: 1.4,
            }}
          >
            {title}
          </span>
        </div>
      )}
      {content && (
        <div
          style={{
            marginTop: '8px',
            color: 'rgba(0, 0, 0, .65)',
            fontSize: '14px',
            marginLeft: '38px',
          }}
        >
          {content}
        </div>
      )}
      <Row gutter={8} type="flex" justify="end" align="middle" style={{ marginTop: 24 }}>
        {React.Children.map(footer, (item, index) => {
          return <Col key={index}>{item}</Col>;
        })}
      </Row>
    </Modal>
  );
};

// 显示ProConfirm对话框的函数
const confirm = (props: ShowProConfirmConfigs) => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const close = () => {
    console.log('removed');
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  };

  ReactDOM.render(<ProConfirm {...props} onClose={close} />, div);
};

export default confirm;
