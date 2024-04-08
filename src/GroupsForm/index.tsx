import { Button, Card, Form, Icon, Popconfirm, Spin, message } from 'antd';
import { FormComponentProps, FormProps, WrappedFormUtils } from 'antd/es/form/Form';
import * as PropTypes from 'prop-types';
import React, { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import EditableGroups, { EditableGroupsMethods, EditableGroupsProps } from '../EditableGroups';
import { FormContext, FormEventBusContext } from '../_utils/FormContext';
import { createFormEventBusWrapper } from 'src/_utils/createFormEventBusWrapper';
import useUpdateEffect from 'src/_utils/useUpdateEffect';
import { handleError } from 'src/_utils/handleError';
import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

interface DragHandleProps {
  listeners?: SyntheticListenerMap;
  attributes: DraggableAttributes;
}

const DragHandle = forwardRef<HTMLSpanElement, DragHandleProps>((props, ref) => (
  <span ref={ref} onClick={(e) => e.stopPropagation()} {...props.listeners} {...props.attributes}>
    <Icon type="menu" style={{ fontSize: '15px', marginRight: 10, cursor: 'grab' }} />
  </span>
));

export type GroupsFormItem = {
  key: string;
  [key: string]: any;
};

export interface RequestParams {
  values: Record<string, any>;
}

export interface RequestResult {}

export type GroupsFormProps = {
  getAddedItem?: (args: { newItem: GroupsFormItem }) => GroupsFormItem;
  request?: (params: RequestParams) => Promise<void>;
  renderItemFormItems?: (params: {
    form: WrappedFormUtils;
    submitLoading: boolean;
    groupItem: GroupsFormItem;
    initialItemFormValues?: Record<string, any>;
    index: number;
    groupItems: GroupsFormItem[];
  }) => PropTypes.ReactNodeLike;
  requestInitialFormValues?: () => Promise<Record<string, any>>;
  initialFormValues?: Record<string, any>;
  initialGroupItems?: EditableGroupsProps<GroupsFormItem>['initialItems'];
  onValuesChange?: (changedValues: Record<string, any>, allValues: Record<string, any>) => void;
  renderGroupTitle?: (args: { item: GroupsFormItem; index: number }) => React.ReactNode;
} & FormProps;

export type GroupsFormInnerProps = GroupsFormProps & FormComponentProps;

const GroupsFormInner: React.FC<GroupsFormInnerProps> = ({
  form,
  initialFormValues: propInitialFormValues,
  renderItemFormItems,
  request,
  requestInitialFormValues,
  initialGroupItems,
  renderGroupTitle,
  getAddedItem,
  ...restFormProps
}) => {
  const editableGroupsRef = useRef<EditableGroupsMethods<GroupsFormItem>>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [groupItems, setGroupItems] = useState(() => initialGroupItems ?? []);
  const [formLoading, setFormLoading] = useState<boolean>(false); // 新增状态，用于跟踪异步表单项的加载状态
  const [initialFormValues, setInitialFormValues] = useState<Record<string, any> | undefined>(
    propInitialFormValues,
  );

  // 使用 FormContext 来确定是否嵌套在 Form 中
  const existingForm = useContext(FormContext);
  const formEventBus = useContext(FormEventBusContext);

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

  const handlerEditableGroupsChange = (items: GroupsFormItem[]) => {
    setGroupItems(items);
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

  useUpdateEffect(() => {
    formEventBus?.emit('onGroupsFormTabItemsChange');
  }, [groupItems]);

  const renderGroupItem: EditableGroupsProps<GroupsFormItem>['renderGroupItem'] = ({
    item,
    index,
    methods,
    listeners,
    attributes,
  }) => {
    return (
      <Card
        title={
          <span>
            <DragHandle listeners={listeners} attributes={attributes} />
            {renderGroupTitle?.({ item, index })}
          </span>
        }
        key={item.key}
        style={{
          marginBottom: 10,
        }}
        extra={
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <Popconfirm
              title="确认删除吗？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => methods.deleteItem(index)}
            >
              <Button
                size="small"
                icon="delete"
                type="link"
                style={{
                  color: 'red',
                }}
              >
                删除
              </Button>
            </Popconfirm>

            <Button
              size="small"
              icon="plus"
              type="link"
              onClick={() => methods.insertItem(index + 1, { key: Math.random() + '' })}
            >
              复制
            </Button>
          </div>
        }
      >
        {renderItemFormItems?.({
          index,
          form: existingForm || form,
          submitLoading,
          groupItem: item,
          initialItemFormValues: initialFormValues?.[item.key],
          groupItems,
        })}
      </Card>
    );
  };

  const renderEditableGroupsSection = () => {
    return (
      <div>
        <EditableGroups<GroupsFormItem>
          ref={editableGroupsRef}
          rowKey={'key'}
          value={groupItems}
          onChange={handlerEditableGroupsChange}
          renderGroupItem={renderGroupItem}
        />
        <Button
          type="dashed"
          block
          onClick={() => {
            const newItem = {
              key: new Date().getTime() + '',
            };
            editableGroupsRef.current?.addItem(
              getAddedItem?.({
                newItem,
              }) || newItem,
            );
          }}
        >
          新增一项
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    if (formLoading) {
      return <Spin />;
    }
    if (requestInitialFormValues) {
      if (initialFormValues) {
        return renderEditableGroupsSection();
      }
      return null;
    }

    return renderEditableGroupsSection();
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

const GroupsForm = createFormEventBusWrapper(
  Form.create<GroupsFormInnerProps>({
    name: 'GroupsForm',
    onValuesChange(props, changedValues, allValues) {
      props.onValuesChange?.(changedValues, allValues);
    },
  })(GroupsFormInner),
);

export default GroupsForm;
