import form from 'antd/es/form';
import { useContext } from 'react';
import { FormContext, FormParentsFieldIdContext, FormEventBusContext } from './FormContext';
import { WrappedFormUtils } from 'antd/es/form/Form';

export const useParentsFormMeta = ({
  mergeIntoForm,
  form,
}: {
  mergeIntoForm?: false | string;
  form: WrappedFormUtils;
}) => {
  // 使用 FormContext 来确定是否嵌套在 Form 中
  const existingForm = useContext(FormContext);
  const existingParentsFieldId = useContext(FormParentsFieldIdContext);

  const parseParentsForm = () => {
    if (typeof mergeIntoForm === 'string') {
      if (!existingForm) {
        throw new Error('不存在父级环境中的 form');
      }

      return {
        ifUsedParentForm: true,
        parentsFieldId: `${existingParentsFieldId}${mergeIntoForm}.`,
        usedForm: existingForm,
      };
    }

    return {
      ifUsedParentForm: false,
      parentsFieldId: '',
      usedForm: form,
    };
  };

  return parseParentsForm();
};
