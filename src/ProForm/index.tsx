import { Form, message } from 'antd';
import { FormComponentProps, WrappedFormUtils } from 'antd/es/form/Form';
import * as PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import { FormContext } from '../_utils/FormContext';

export interface RequestParams {
  values: Record<string, any>;
}

export interface RequestResult {}

export type ProFormProps = {
  request?: (params: RequestParams) => Promise<void>;
  renderFormItems?: (params: {
    form: WrappedFormUtils;
    submitLoading: boolean;
  }) => PropTypes.ReactNodeLike;
  onValuesChange?: (changedValues: Record<string, any>, allValues: Record<string, any>) => void;
};

export type AdvancedProFormProps = ProFormProps & FormComponentProps;

const AdvancedProFormInner: React.FC<AdvancedProFormProps> = ({
  form,
  renderFormItems,
  request,
  ...restFormProps
}) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  // 检查是否已经存在 form 上下文
  const existingForm = useContext(FormContext);

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
    } catch (error) {
      let errorMessage;

      // 判断错误的类型
      if (typeof error === 'string') {
        // 如果错误是一个字符串
        errorMessage = error;
      } else if (error instanceof Error) {
        // 如果错误是Error对象
        errorMessage = error.message;
      }

      console.log(error);
      message.error(errorMessage || '提交表单异常');
    } finally {
      setSubmitLoading(false);
    }
  };

  // 如果已经存在 form 上下文，则不创建新的 Provider
  if (existingForm) {
    return <>{renderFormItems?.({ form: existingForm, submitLoading })}</>;
  } else {
    // 否则，创建一个新的 Provider，并标记为嵌套
    return (
      <FormContext.Provider value={form}>
        <Form onSubmit={handleSubmit} {...restFormProps}>
          {renderFormItems?.({ form, submitLoading })}
        </Form>
      </FormContext.Provider>
    );
  }
};

const WrappedAdvancedProForm = Form.create<AdvancedProFormProps>({
  name: 'ProForm',
  onValuesChange(props, changedValues, allValues) {
    props.onValuesChange?.(changedValues, allValues);
  },
})(AdvancedProFormInner);

export default WrappedAdvancedProForm;
