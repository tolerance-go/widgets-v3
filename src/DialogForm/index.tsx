import { Button, Form, Spin, message } from 'antd';
import { FormComponentProps, WrappedFormUtils } from 'antd/es/form/Form';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { FormContext, FormParentsFieldIdContext } from '../_utils/FormContext';
import Container from './Container';
import { createFormEventBusWrapper } from 'src/_utils/createFormEventBusWrapper';
import { useParentsFormMeta } from 'src/_utils/useParentsFormMeta';
import { handleError } from 'src/_utils/handleError';
import './index.less';
import { classNames } from 'src/_utils/classNames';

// 辅助函数来检测一个对象是否是Promise
// 这是Promise遵循的Promise/A+规范的一部分
function isPromise(obj: any): boolean {
  return !!obj && typeof obj.then === 'function';
}

// 定义 initialFormValues 为一个具有任意字段的对象类型
type InitialFormValues = {
  [key: string]: any;
};
interface RequestParams {
  values: Record<string, any>;
}
export type DialogFormBaseProps = React.PropsWithChildren<{
  mergeIntoForm?: false | string;
  width?: string | number;
  title?: string;
  trigger?: ReactElement;
  renderFormItems?: (args: {
    form: WrappedFormUtils;
    initialFormValues?: InitialFormValues;
    parentsFieldId: string;
  }) => React.ReactNode;
  requestInitialFormValues?: () => Promise<InitialFormValues>;
  renderActionGroup?: (args: {
    toggleModal: () => void;
    form: WrappedFormUtils;
    submitLoading: boolean;
  }) => React.ReactNode;
  // 阻止最外层点击冒泡
  stopWrapClickPropagation?: boolean;
  onValuesChange?: (changedValues: Record<string, any>, allValues: Record<string, any>) => void;
  request?: (params: RequestParams) => Promise<void>;
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
  mergeIntoForm,
  request,
  ...restProps
}: DialogFormInnerProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false); // 新增状态，用于跟踪异步表单项的加载状态
  const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>();
  const [submitLoading, setSubmitLoading] = useState(false);
  // 使用 FormContext 来确定是否嵌套在 Form 中

  const { ifUsedParentForm, parentsFieldId, usedForm } = useParentsFormMeta({
    mergeIntoForm,
    form,
  });

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
      return renderActionGroup({ toggleModal, form: usedForm, submitLoading });
    }
    return null;
  };

  const resetData = () => {
    setInitialFormValues(undefined);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!request) {
      return;
    }

    try {
      const formValues = await new Promise<Record<string, any>>((resolve, reject) => {
        form.validateFieldsAndScroll((err, values) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(values);
        });
      });

      setSubmitLoading(true);
      await request({ values: formValues });
      toggleModal();
    } catch (error) {
      handleError(error, '表单验证失败'); // Using the common error handling function
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderFormContent = (formItems?: React.ReactNode) => {
    const footer = [
      <Button key="close" onClick={toggleModal}>
        关闭
      </Button>,
      renderCustomActionGroupInner(),
    ];

    if (type === 'drawer') {
      return (
        <>
          <div style={{ paddingBottom: 24 }}>{formItems}</div>
          <div className={classNames('wg-dialog-footer', 'wg-drawer-footer')}>{footer}</div>
        </>
      );
    }

    return (
      <>
        <div style={{ paddingBottom: 24 }}>{formItems}</div>
        <div className={classNames('wg-dialog-footer', 'wg-modal-footer')}>{footer}</div>
      </>
    );
  };

  const renderContent = () => {
    if (formLoading) {
      return <Spin />;
    }

    if (requestInitialFormValues) {
      if (initialFormValues) {
        return renderFormContent(
          renderFormItems?.({
            form: usedForm,
            initialFormValues,
            parentsFieldId,
          }),
        );
      }

      return null;
    }

    return renderFormContent(
      renderFormItems?.({
        form: usedForm,
        parentsFieldId,
      }),
    );
  };

  const renderForm = () => {
    if (ifUsedParentForm) {
      return (
        <FormParentsFieldIdContext.Provider value={parentsFieldId}>
          {renderContent()}
        </FormParentsFieldIdContext.Provider>
      );
    }

    return (
      <FormContext.Provider value={form}>
        <Form onSubmit={handleSubmit} {...restProps}>
          {renderContent()}
        </Form>
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
        forceRender={ifUsedParentForm ? true : false}
        destroyOnClose={ifUsedParentForm ? false : true}
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
        footer={null}
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
