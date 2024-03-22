import { Button, Form, Spin, message } from 'antd';
import { FormComponentProps, WrappedFormUtils } from 'antd/lib/form/Form';
import React, { ReactElement, useEffect, useState } from 'react';
import Container from './Container';

// 辅助函数来检测一个对象是否是Promise
// 这是Promise遵循的Promise/A+规范的一部分
function isPromise(obj: any): boolean {
  return !!obj && typeof obj.then === 'function';
}

// 定义 initialFormValues 为一个具有任意字段的对象类型
type InitialFormValues = {
  [key: string]: any;
};

export type DialogFormBaseProps = React.PropsWithChildren<{
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

export type DialogFormProps =
  | ({
      type: 'modal';
    } & DialogFormBaseProps)
  | ({
      type: 'drawer';
    } & DialogFormBaseProps);

export type DialogFormInnerProps = DialogFormProps & FormComponentProps;

const DialogFormInner = ({
  type,
  form,
  width,
  title,
  trigger,
  renderFormItems,
  requestInitialFormValues,
  renderActionGroup,
  ...restProps
}: DialogFormInnerProps) => {
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
      <Container
        type={type}
        destroyOnClose
        width={width}
        title={title}
        visible={isVisible}
        onCancel={() => {
          toggleModal();
          resetData();
        }}
        onClose={() => {
          toggleModal();
          resetData();
        }}
        footer={[
          <Button key="close" onClick={toggleModal}>
            关闭
          </Button>,
          renderCustomActionGroupInner(),
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
      </Container>
    </>
  );
};

const DialogForm = Form.create<DialogFormInnerProps>({ name: 'DialogForm' })(DialogFormInner);

export default DialogForm;
