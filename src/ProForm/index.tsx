import { Form } from 'antd';
import { FormComponentProps, WrappedFormUtils } from 'antd/es/form/Form';
import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { createFormEventBusWrapper } from 'src/_utils/createFormEventBusWrapper';
import { handleError } from 'src/_utils/handleError';
import { useParentsFormMeta } from 'src/_utils/useParentsFormMeta';
import { FormContext, FormParentsFieldIdContext } from '../_utils/FormContext';

export interface RequestParams {
  values: Record<string, any>;
}

export interface RequestResult {}

export type ProFormProps = {
  mergeIntoForm?: false | string;
  request?: (params: RequestParams) => Promise<void>;
  renderFormItems?: (params: {
    form: WrappedFormUtils;
    submitLoading: boolean;
    parentsFieldId: string;
  }) => PropTypes.ReactNodeLike;
  onValuesChange?: (changedValues: Record<string, any>, allValues: Record<string, any>) => void;
};

export type ProFormInnerProps = ProFormProps & FormComponentProps;

const ProFormInner: React.FC<ProFormInnerProps> = ({
  form,
  renderFormItems,
  request,
  mergeIntoForm,
  ...restFormProps
}) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const { ifUsedParentForm, parentsFieldId, usedForm } = useParentsFormMeta({
    mergeIntoForm,
    form,
  });

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
      handleError(error, '提交表单异常'); // Using the common error handling function
    } finally {
      setSubmitLoading(false);
    }
  };

  // 如果已经存在 form 上下文，则不创建新的 Provider
  if (ifUsedParentForm) {
    return (
      <FormParentsFieldIdContext.Provider value={parentsFieldId}>
        {renderFormItems?.({ form: usedForm, submitLoading, parentsFieldId })}
      </FormParentsFieldIdContext.Provider>
    );
  } else {
    // 否则，创建一个新的 Provider，并标记为嵌套
    return (
      <FormContext.Provider value={form}>
        <Form onSubmit={handleSubmit} {...restFormProps}>
          {renderFormItems?.({ form, submitLoading, parentsFieldId })}
        </Form>
      </FormContext.Provider>
    );
  }
};

const ProForm = createFormEventBusWrapper(
  Form.create<ProFormInnerProps>({
    name: 'ProForm',
    onValuesChange(props, changedValues, allValues) {
      props.onValuesChange?.(changedValues, allValues);
    },
  })(ProFormInner),
);

export default ProForm;
