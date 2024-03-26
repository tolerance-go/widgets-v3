import { Col, Form, Row } from 'antd';
import { FormItemProps } from 'antd/es/form';
import {
  FormComponentProps,
  FormProps,
  GetFieldDecoratorOptions,
  WrappedFormUtils,
} from 'antd/es/form/Form';
import { ColProps, RowProps } from 'antd/es/grid';
import React, { ForwardedRef, forwardRef, useImperativeHandle } from 'react';

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
  externalForm?: WrappedFormUtils;
};

export type SchemaFormInnerProps = SchemaFormProps & FormComponentProps;

export type SchemaFormMethods = {};

const SchemaForm = forwardRef(
  (
    { schema, form, wrappedComponentRef, externalForm }: SchemaFormInnerProps,
    ref: ForwardedRef<SchemaFormMethods>,
  ) => {
    const usedForm = externalForm ?? form;

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
          return (
            <Form {...schema.props} key={schema.props?.key ? schema.props.key : index}>
              {schema.children?.map((item) => renderComponent(item, index))}
            </Form>
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
              {usedForm.getFieldDecorator(
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

export default Form.create<SchemaFormInnerProps>({ name: 'schema_form' })(SchemaForm);
