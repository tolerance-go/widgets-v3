import { Button, Form, Spin, message } from 'antd';
import { FormComponentProps, WrappedFormUtils } from 'antd/es/form/Form';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { FormContext } from '../_utils/FormContext';
import Container from './Container';
import { createFormEventBusWrapper } from 'src/_utils/createFormEventBusWrapper';

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
  renderFormItems?: (args: {
    form: WrappedFormUtils;
    initialFormValues?: InitialFormValues;
  }) => React.ReactNode;
  requestInitialFormValues?: () => Promise<InitialFormValues>;
  renderActionGroup?: (args: {
    toggleModal: () => void;
    form: WrappedFormUtils;
  }) => React.ReactNode;
  // 阻止最外层点击冒泡
  stopWrapClickPropagation?: boolean;
  onValuesChange?: (changedValues: Record<string, any>, allValues: Record<string, any>) => void;
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
  stopWrapClickPropagation,
  ...restProps
}: DialogFormInnerProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false); // 新增状态，用于跟踪异步表单项的加载状态
  const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>();
  // 使用 FormContext 来确定是否嵌套在 Form 中
  const existingForm = useContext(FormContext);
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

  const renderContent = () => {
    if (formLoading) {
      return <Spin />;
    }

    if (requestInitialFormValues) {
      if (initialFormValues) {
        return renderFormItems?.({
          form: existingForm || form,
          initialFormValues,
        });
      }

      return null;
    }

    return renderFormItems?.({
      form: existingForm || form,
    });
  };

  const renderForm = () => {
    if (existingForm) {
      return renderContent();
    }

    return (
      <FormContext.Provider value={form}>
        <Form {...restProps}>{renderContent()}</Form>;
      </FormContext.Provider>
    );
  };

  return (
    <>
      {trigger &&
        React.cloneElement(trigger, {
          onClick: (e: React.MouseEvent<HTMLElement>) => {
            trigger.props.onClick?.(e);
            toggleModal();
          },
        })}
      <Container
        wrapProps={{
          onClick: (e: React.MouseEvent<HTMLElement>) => {
            if (stopWrapClickPropagation) {
              e.stopPropagation();
            }

            // 如果是最外层点击，也就是 mask 上点击，需要手动关闭
            if (e.currentTarget === e.target) {
              toggleModal();
            }
          },
        }}
        type={type}
        destroyOnClose={existingForm ? false : true}
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
        {renderForm()}
      </Container>
    </>
  );
};

const DialogForm = createFormEventBusWrapper(
  Form.create<DialogFormInnerProps>({
    name: 'DialogForm',
    onValuesChange(props, changedValues, allValues) {
      props.onValuesChange?.(changedValues, allValues);
    },
  })(DialogFormInner),
);

export default DialogForm;
