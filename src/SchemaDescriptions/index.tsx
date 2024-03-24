import React, { ForwardedRef, forwardRef, useImperativeHandle } from 'react';
import { Tabs, Card, Descriptions, Table } from 'antd';
import { TabPaneProps, TabsProps } from 'antd/es/tabs';
import { CardProps } from 'antd/es/card';
import { DescriptionsItemProps, DescriptionsProps } from 'antd/es/descriptions';
import { TableProps } from 'antd/es/table'; // 导入Table的Props类型

// 定义Table子组件的Schema类型
type TableSchema = {
  type: 'Table';
  props: TableProps<Record<string, any>> & { key?: string | number }; // 使用any作为泛型参数，也可以根据实际数据结构进行具体化
};

// 定义特定于Tabs和Descriptions的子组件类型
type TabPaneSchema = {
  type: 'TabPane';
  props: TabPaneProps;
  children?: DescriptionsComponentSchema[];
};

type DescriptionsItemSchema = {
  type: 'DescriptionsItem';
  props: DescriptionsItemProps & { key?: string | number };
};

// 使用具体的Props类型来增强类型安全性和智能提示
export type DescriptionsComponentSchema =
  | {
      type: 'Tabs';
      props: TabsProps & { key?: React.Key };
      children?: TabPaneSchema[];
    }
  | TabPaneSchema
  | {
      type: 'Card';
      props: CardProps & { key?: React.Key };
      children?: DescriptionsComponentSchema[];
    }
  | {
      type: 'Descriptions';
      props: DescriptionsProps & { key?: React.Key };
      children?: DescriptionsItemSchema[];
    }
  | DescriptionsItemSchema
  | TableSchema; // 添加TableSchema

export type SchemaDescriptionsProps = {
  schema?: DescriptionsComponentSchema[];
};

export type SchemaDescriptionsMethods = {};

const SchemaDescriptions = forwardRef(
  ({ schema }: SchemaDescriptionsProps, ref: ForwardedRef<SchemaDescriptionsMethods>) => {
    const methods: SchemaDescriptionsMethods = {};

    useImperativeHandle(ref, () => methods);

    const renderComponent = (
      schema: DescriptionsComponentSchema | undefined,
      index: number,
    ): React.ReactElement => {
      if (!schema) return <></>;

      switch (schema.type) {
        case 'Tabs':
          return (
            <Tabs type="card" {...schema.props} key={schema.props?.key ? schema.props.key : index}>
              {schema.children?.map((child, index) => (
                <Tabs.TabPane tab={(child.props as TabPaneProps)?.tab} key={index.toString()}>
                  {renderComponent(child, index)}
                </Tabs.TabPane>
              ))}
            </Tabs>
          );
        case 'TabPane':
          return <>{schema.children?.map((child, index) => renderComponent(child, index))}</>;
        case 'Card':
          return (
            <Card
              bordered
              {...schema.props}
              style={{ marginBottom: 16, ...schema.props.style }}
              key={
                schema.props?.key
                  ? schema.props?.key
                  : typeof schema.props.title === 'string' || schema.props.title === 'number'
                  ? schema.props.title
                  : undefined
              }
            >
              {schema.children?.map(renderComponent)}
            </Card>
          );
        case 'Descriptions':
          return (
            <Descriptions
              {...schema.props}
              key={
                schema.props?.key
                  ? schema.props?.key
                  : typeof schema.props.title === 'string' || schema.props.title === 'number'
                  ? schema.props.title
                  : undefined
              }
            >
              {schema.children?.map((child, index) => renderComponent(child, index))}
            </Descriptions>
          );
        case 'DescriptionsItem':
          // Descriptions.Item 需要特别处理，因为它需要label和value属性
          return (
            <Descriptions.Item
              label={schema.props?.label}
              key={
                schema.props?.key
                  ? schema.props?.key
                  : typeof schema.props.label === 'string' || schema.props.label === 'number'
                  ? schema.props.label
                  : undefined
              }
            >
              {schema.props?.children}
            </Descriptions.Item>
          );
        case 'Table': // 处理Table类型的模式
          return <Table {...schema.props} key={schema.props?.key ? schema.props.key : index} />;
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

export default SchemaDescriptions;
