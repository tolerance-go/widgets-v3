import { Form, message } from 'antd';
import { FormComponentProps, WrappedFormUtils } from 'antd/lib/form/Form';
import * as PropTypes from 'prop-types';
import React, { useState } from 'react';

export interface RequestParams {
  values: Record<string, any>;
}

export interface RequestResult {}

export type BaseFormProps = {
  request?: (params: RequestParams) => Promise<void>;
  renderFormItems?: (params: {
    form: WrappedFormUtils;
    submitLoading: boolean;
  }) => PropTypes.ReactNodeLike;
};

export type AdvancedBaseFormProps = BaseFormProps & FormComponentProps;

const AdvancedBaseFormInner: React.FC<AdvancedBaseFormProps> = ({
  form,
  renderFormItems,
  request,
  ...restFormProps
}) => {
  const [submitLoading, setSubmitLoading] = useState(false);

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
  return (
    <Form onSubmit={handleSubmit} {...restFormProps}>
      {renderFormItems?.({ form, submitLoading })}
    </Form>
  );
};

const WrappedAdvancedBaseForm = Form.create<AdvancedBaseFormProps>({
  name: 'advanced_base_form',
})(AdvancedBaseFormInner);

export default WrappedAdvancedBaseForm;
