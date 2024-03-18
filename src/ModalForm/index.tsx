import { Button, Form, Modal, Spin, message } from 'antd';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { FormComponentProps, WrappedFormUtils } from 'antd/lib/form/Form';

// 辅助函数来检测一个对象是否是Promise
// 这是Promise遵循的Promise/A+规范的一部分
function isPromise(obj: any): boolean {
  return !!obj && typeof obj.then === 'function';
}

// 定义 initialFormValues 为一个具有任意字段的对象类型
type InitialFormValues = {
  [key: string]: any;
};

type ModalFormProps = React.PropsWithChildren<{
  width?: string | number;
  title?: string;
  trigger?: ReactElement;
  renderFormItems: (args: {
    form: WrappedFormUtils;
    initialFormValues?: InitialFormValues;
  }) => React.ReactNode;
  requestInitialFormValues?: () => Promise<InitialFormValues>;
  renderActionGroup?: (args: {
    toggleModal: () => void;
    form: WrappedFormUtils;
  }) => React.ReactNode;
}>;

export type ModalFormInnerProps = ModalFormProps & FormComponentProps;

const ModalFormInner = ({
  form,
  width,
  title,
  trigger,
  renderFormItems,
  requestInitialFormValues,
  renderActionGroup,
  ...restProps
}: ModalFormInnerProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false); // 新增状态，用于跟踪异步表单项的加载状态
  const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>();

  // 切换模态框的显示状态
  const toggleModal = () => setIsVisible(!isVisible);

  // 处理异步表单项渲染
  useEffect(() => {
    const fetchInitialFormValues = async () => {
      if (isVisible && requestInitialFormValues) {
        setFormLoading(true);
        try {
          const values = await requestInitialFormValues();
          setInitialFormValues(values);
        } catch (error) {
          console.log(error);
          message.error('获取表单初始化数据异常');
        } finally {
          setFormLoading(false);
        }
      }
    };
    fetchInitialFormValues();
  }, [isVisible]);

  // 自定义操作组件的渲染
  const renderCustomActionGroupInner = () => {
    if (typeof renderActionGroup === 'function') {
      return renderActionGroup({ toggleModal, form });
    }
    return null;
  };

  const resetData = () => {
    setInitialFormValues(undefined);
  };

  return (
    <>
      {trigger && React.cloneElement(trigger, { onClick: toggleModal })}
      <Modal
        destroyOnClose
        width={width}
        title={title}
        visible={isVisible}
        onCancel={() => {
          toggleModal();
          resetData();
        }}
        footer={[
          renderCustomActionGroupInner(),
          <Button key="close" onClick={toggleModal}>
            关闭
          </Button>,
        ]}
      >
        <Form {...restProps}>
          {formLoading ? (
            <Spin />
          ) : requestInitialFormValues ? (
            initialFormValues ? (
              renderFormItems({ form, initialFormValues })
            ) : null
          ) : (
            renderFormItems({ form })
          )}
        </Form>
      </Modal>
    </>
  );
};

const ModalForm = Form.create<ModalFormInnerProps>({ name: 'modalForm' })(ModalFormInner);

export default ModalForm;
