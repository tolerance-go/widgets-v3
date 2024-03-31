import { Form, Spin, message } from 'antd';
import { FormComponentProps, WrappedFormUtils } from 'antd/es/form/Form';
import * as PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import EditableTabs, { EditableTabsProps, Item } from '../EditableTabs';
import { MakeOptional } from '../_utils/MakeOptional';
import useUpdateEffect from '../_utils/useUpdateEffect';
import { FormContext } from '../_utils/FormContext';

export interface RequestParams {
  values: Record<string, any>;
}

export interface RequestResult {}

export type TabsFormProps = {
  request?: (params: RequestParams) => Promise<void>;
  renderItemFormItems?: (params: {
    form: WrappedFormUtils;
    submitLoading: boolean;
    tabItem: Item;
    initialItemFormValues?: Record<string, any>;
    index: number;
  }) => PropTypes.ReactNodeLike;
  requestInitialFormValues?: () => Promise<Record<string, any>>;
  initialFormValues?: Record<string, any>;
  initialTabItems?: EditableTabsProps['initialItems'];
};

export type TabsFormInnerProps = TabsFormProps & FormComponentProps;

const TabsFormInner: React.FC<TabsFormInnerProps> = ({
  form,
  initialFormValues: propInitialFormValues,
  renderItemFormItems,
  request,
  requestInitialFormValues,
  initialTabItems,
  ...restFormProps
}) => {
  const [submitLoading, setSubmitLoading] = useState(false);

  const [tabItems, setTabItems] = useState(initialTabItems);
  const [formLoading, setFormLoading] = useState<boolean>(false); // 新增状态，用于跟踪异步表单项的加载状态
  const [initialFormValues, setInitialFormValues] = useState<Record<string, any> | undefined>(
    propInitialFormValues,
  );

  // 使用 FormContext 来确定是否嵌套在 Form 中
  const existingForm = useContext(FormContext);

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

  useEffect(() => {
    const fetchInitialFormValues = async () => {
      if (requestInitialFormValues) {
        setFormLoading(true);
        try {
          const values = await requestInitialFormValues();
          setInitialFormValues(values);
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
          message.error(errorMessage || '获取表单初始化数据异常');
        } finally {
          setFormLoading(false);
        }
      }
    };
    fetchInitialFormValues();
  }, []);

  const renderContent = () => {
    if (formLoading) {
      return <Spin />;
    }
    if (requestInitialFormValues) {
      if (initialFormValues) {
        return (
          <EditableTabs
            value={tabItems}
            onChange={setTabItems}
            renderTabPane={({ item, index }) => {
              return renderItemFormItems?.({
                index,
                form: existingForm || form,
                submitLoading,
                tabItem: item,
                initialItemFormValues: initialFormValues?.[item.key],
              });
            }}
          />
        );
      }
      return null;
    }

    return (
      <EditableTabs
        value={tabItems}
        onChange={setTabItems}
        renderTabPane={({ item, index }) => {
          return renderItemFormItems?.({
            form: existingForm || form,
            index,
            submitLoading,
            tabItem: item,
            initialItemFormValues: initialFormValues?.[item.key],
          });
        }}
      />
    );
  };

  if (existingForm) {
    return renderContent();
  }

  return (
    <FormContext.Provider value={form}>
      <Form onSubmit={handleSubmit} {...restFormProps}>
        {renderContent()}
      </Form>
    </FormContext.Provider>
  );
};

const TabsForm = Form.create<TabsFormInnerProps>({
  name: 'tabs_form',
})(TabsFormInner);

export default TabsForm;
