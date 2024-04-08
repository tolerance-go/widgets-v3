import { Button, Form, Spin, message } from 'antd';
import { FormComponentProps, WrappedFormUtils } from 'antd/es/form/Form';
import * as PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import EditableTabs, { EditableTabsProps, Item } from '../EditableTabs';
import { FormContext, FormEventBusContext, FormParentsFieldIdContext } from '../_utils/FormContext';
import { createFormEventBusWrapper } from 'src/_utils/createFormEventBusWrapper';
import useUpdateEffect from 'src/_utils/useUpdateEffect';
import { useParentsFormMeta } from 'src/_utils/useParentsFormMeta';
import SmartSteps, { SmartStepItem, SmartStepsProps } from 'src/SmartSteps';
import { handleError } from 'src/_utils/handleError';

export type StepsFormStepItem = SmartStepItem & {
  key: string;
};

export type StepsFormProps = {
  steps?: StepsFormStepItem[];
  mergeIntoForm?: false | string;
  request?: (params: { values: Record<string, any> }) => Promise<void>;
  renderItemFormItems?: (params: {
    form: WrappedFormUtils;
    submitLoading: boolean;
    stepItem: SmartStepItem;
    initialItemFormValues?: Record<string, any>;
    index: number;
    parentsFieldId: string;
  }) => PropTypes.ReactNodeLike;
  requestInitialFormValues?: () => Promise<Record<string, any>>;
  initialFormValues?: Record<string, any>;
  onValuesChange?: (changedValues: Record<string, any>, allValues: Record<string, any>) => void;
};

type StepsFormInnerProps = StepsFormProps & FormComponentProps;

const StepsFormInner: React.FC<StepsFormInnerProps> = ({
  steps,
  form,
  initialFormValues: propInitialFormValues,
  renderItemFormItems,
  request,
  requestInitialFormValues,
  mergeIntoForm,
  ...restFormProps
}) => {
  const [submitLoading, setSubmitLoading] = useState(false);

  const [formLoading, setFormLoading] = useState<boolean>(false); // 新增状态，用于跟踪异步表单项的加载状态
  const [initialFormValues, setInitialFormValues] = useState<Record<string, any> | undefined>(
    propInitialFormValues,
  );

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
      const allFormValues = await new Promise<Record<string, any>>((resolve, reject) => {
        form.validateFieldsAndScroll((err, values) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(values);
        });
      });

      setSubmitLoading(true);
      await request({ values: allFormValues });
    } catch (error) {
      handleError(error, '提交表单异常');
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialFormValues = async () => {
      if (requestInitialFormValues) {
        setFormLoading(true);
        try {
          const values = await requestInitialFormValues();
          setInitialFormValues(values);
        } catch (error) {
          handleError(error, '获取表单初始化数据异常');
        } finally {
          setFormLoading(false);
        }
      }
    };
    fetchInitialFormValues();
  }, []);

  const renderFooter: SmartStepsProps<StepsFormStepItem>['renderContent'] = ({
    isFirst,
    isLast,
    methods: { goBack, goNext },
  }) => {
    return (
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!isFirst && <Button onClick={() => goBack()}>上一步</Button>}
        {!isLast && (
          <Button type="primary" onClick={() => goNext()}>
            下一步
          </Button>
        )}
        {isLast && (
          <Button type="primary" htmlType="submit" loading={submitLoading}>
            提交
          </Button>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (formLoading) {
      return <Spin />;
    }
    if (requestInitialFormValues) {
      if (initialFormValues) {
        return (
          <SmartSteps<StepsFormStepItem>
            forceRender
            steps={steps}
            renderContent={(args) => {
              const { index, item } = args;
              return (
                <div>
                  {renderItemFormItems?.({
                    index,
                    form: usedForm,
                    submitLoading,
                    stepItem: item,
                    initialItemFormValues: initialFormValues?.[item.key],
                    parentsFieldId,
                  })}
                  {renderFooter(args)}
                </div>
              );
            }}
          />
        );
      }
      return null;
    }

    return (
      <SmartSteps<StepsFormStepItem>
        forceRender
        steps={steps}
        renderContent={(args) => {
          const { index, item } = args;
          return (
            <div>
              {renderItemFormItems?.({
                index,
                form: usedForm,
                submitLoading,
                stepItem: item,
                initialItemFormValues: initialFormValues?.[item.key],
                parentsFieldId,
              })}
              {renderFooter(args)}
            </div>
          );
        }}
      />
    );
  };

  if (ifUsedParentForm) {
    return (
      <FormParentsFieldIdContext.Provider value={parentsFieldId}>
        {renderContent()}
      </FormParentsFieldIdContext.Provider>
    );
  }

  return (
    <FormContext.Provider value={form}>
      <Form onSubmit={handleSubmit} {...restFormProps}>
        {renderContent()}
      </Form>
    </FormContext.Provider>
  );
};

const StepsForm = createFormEventBusWrapper(
  Form.create<StepsFormInnerProps>({
    name: 'StepsForm',
    onValuesChange(props, changedValues, allValues) {
      props.onValuesChange?.(changedValues, allValues);
    },
  })(StepsFormInner),
);

export default StepsForm;
