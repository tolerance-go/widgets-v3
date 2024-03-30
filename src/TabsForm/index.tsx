import { Form, Spin, message } from 'antd';
import { FormComponentProps, WrappedFormUtils } from 'antd/es/form/Form';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import EditableTabs, { EditableTabsProps, Item } from '../EditableTabs';
import { MakeOptional } from '../_utils/MakeOptional';
import useUpdateEffect from '../_utils/useUpdateEffect';

type ValueItem = {
  tabItem: Item;
  formValues?: Record<string, any>;
};

export interface RequestParams {
  values: ValueItem[];
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
  requestInitialFormValues?: () => Promise<ValueItem[]>;
  initialFormValues?: ValueItem[];
  inForm?: boolean;
};

export type TabsFormInnerProps = TabsFormProps & FormComponentProps;

const TabsFormInner: React.FC<TabsFormInnerProps> = ({
  form,
  initialFormValues: propInitialFormValues,
  renderItemFormItems,
  request,
  requestInitialFormValues,
  inForm,
  ...restFormProps
}) => {
  const [submitLoading, setSubmitLoading] = useState(false);

  const [tabItems, setTabItems] = useState(() =>
    propInitialFormValues?.map((item) => item.tabItem),
  );
  const [formLoading, setFormLoading] = useState<boolean>(false); // 新增状态，用于跟踪异步表单项的加载状态
  const [initialFormValues, setInitialFormValues] = useState<ValueItem[] | undefined>(
    propInitialFormValues,
  );

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

      // 新增部分：过滤formValues以匹配当前tabItems的key
      const mergedFormValues = (tabItems ?? []).map((item) => {
        return {
          tabItem: item,
          formValues: allFormValues[item.key],
        };
      });

      setSubmitLoading(true);
      await request({ values: mergedFormValues });
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
          setTabItems(values.map((item) => item.tabItem));
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
                form,
                submitLoading,
                tabItem: item,
                initialItemFormValues: initialFormValues.find((it) => it.tabItem.key === item.key)
                  ?.formValues,
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
            form,
            index,
            submitLoading,
            tabItem: item,
            initialItemFormValues: initialFormValues?.find((it) => it.tabItem.key === item.key)
              ?.formValues,
          });
        }}
      />
    );
  };

  if (inForm) {
    return renderContent();
  }

  return (
    <Form onSubmit={handleSubmit} {...restFormProps}>
      {renderContent()}
    </Form>
  );
};

const TabsForm = Form.create<TabsFormInnerProps>({
  name: 'tabs_form',
})(TabsFormInner);

export default TabsForm;
