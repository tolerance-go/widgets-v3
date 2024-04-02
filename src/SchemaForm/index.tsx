import { Col, Form, Row } from 'antd';
import { FormItemProps } from 'antd/es/form';
import {
  FormComponentProps,
  FormProps,
  GetFieldDecoratorOptions,
  WrappedFormUtils,
} from 'antd/es/form/Form';
import { ColProps, RowProps } from 'antd/es/grid';
import React, { ForwardedRef, forwardRef, useContext, useImperativeHandle } from 'react';
import { FormContext } from 'src/_utils/FormContext';
import { createFormEventBusWrapper } from 'src/_utils/createFormEventBusWrapper';

// 新增FormItemSchema类型，包括getFieldDecorator的参数
type FormSchema = {
  type: 'Form';
  props: FormProps & { key?: string | number };
  children?: FormComponentSchema[];
};

// 新增FormItemSchema类型，包括getFieldDecorator的参数
type FormItemSchema = {
  type: 'FormItem';
  props: FormItemProps & { key?: string | number };
  children?: FormComponentSchema[];
};

type FormFieldSchema = {
  type: 'FormField';
  id: string;
  options?: GetFieldDecoratorOptions;
  children?: FormComponentSchema;
};

// 新增Row和Col布局组件的Schema类型
type RowSchema = {
  type: 'Row';
  props: RowProps & { key?: string | number };
  children?: FormComponentSchema[];
};

type ColSchema = {
  type: 'Col';
  props: ColProps & { key?: string | number };
  children?: FormComponentSchema[];
};

// 定义Form相关组件的集合类型
export type FormComponentSchema =
  | FormSchema
  | FormItemSchema
  | RowSchema
  | ColSchema
  | FormFieldSchema
  | {
      type: 'Node';
      component: React.ReactNode;
    };

export type SchemaFormProps = {
  schema?: FormComponentSchema[];
  onValuesChange?: (changedValues: Record<string, any>, allValues: Record<string, any>) => void;
};

export type SchemaFormInnerProps = SchemaFormProps & FormComponentProps;

export type SchemaFormMethods = {};

const SchemaForm = forwardRef(
  ({ schema, form }: SchemaFormInnerProps, ref: ForwardedRef<SchemaFormMethods>) => {
    // 检查是否已经存在 form 上下文
    const existingForm = useContext(FormContext);

    const methods: SchemaFormMethods = {};

    useImperativeHandle(ref, () => methods);

    const renderComponent = (
      schema: FormComponentSchema | undefined,
      index: number,
    ): React.ReactNode => {
      if (!schema) return <></>;

      switch (schema.type) {
        case 'Node':
          return schema.component;
        case 'Form':
          return existingForm ? (
            schema.children?.map((item) => renderComponent(item, index))
          ) : (
            <FormContext.Provider value={form}>
              <Form {...schema.props} key={schema.props?.key ? schema.props.key : index}>
                {schema.children?.map((item) => renderComponent(item, index))}
              </Form>
            </FormContext.Provider>
          );
        case 'FormItem':
          return (
            <Form.Item {...schema.props} key={schema.props?.key ? schema.props.key : index}>
              {schema.children?.map((item) => renderComponent(item, index))}
            </Form.Item>
          );
        case 'FormField':
          return (
            <React.Fragment key={schema.id}>
              {(existingForm || form).getFieldDecorator(
                schema.id,
                schema.options,
              )(renderComponent(schema.children, index))}
            </React.Fragment>
          );
        case 'Row':
          return (
            <Row {...schema.props} key={schema.props?.key ? schema.props.key : index}>
              {schema.children?.map((child, index) => renderComponent(child, index))}
            </Row>
          );
        case 'Col':
          return (
            <Col {...schema.props} key={schema.props?.key ? schema.props.key : index}>
              {schema.children?.map((child, index) => renderComponent(child, index))}
            </Col>
          );
        default:
          return <></>;
      }
    };

    return (
      <>
        {schema?.map((schemaItem, index) => (
          <React.Fragment key={index}>{renderComponent(schemaItem, index)}</React.Fragment>
        ))}
      </>
    );
  },
);

export default createFormEventBusWrapper(
  Form.create<SchemaFormInnerProps>({
    name: 'SchemaForm',
    onValuesChange(props, changedValues, allValues) {
      props.onValuesChange?.(changedValues, allValues);
    },
  })(SchemaForm),
);
