import React, { ForwardedRef, forwardRef, useImperativeHandle } from 'react';
import { Tabs, Card, Descriptions } from 'antd';
import 'antd/dist/antd.css'; // 确保导入了antd的样式
import { TabPaneProps, TabsProps } from 'antd/lib/tabs';
import { CardProps } from 'antd/lib/card';
import { DescriptionsItemProps, DescriptionsProps } from 'antd/lib/descriptions';

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
      props: TabsProps;
      children?: TabPaneSchema[];
    }
  | TabPaneSchema
  | {
      type: 'Card';
      props: CardProps;
      children?: DescriptionsComponentSchema[];
    }
  | {
      type: 'Descriptions';
      props: DescriptionsProps;
      children?: DescriptionsItemSchema[];
    }
  | DescriptionsItemSchema;

export type SchemaDescriptionsProps = {
  schema?: DescriptionsComponentSchema;
};

export type SchemaDescriptionsMethods = {};

const SchemaDescriptions = forwardRef(
  ({ schema }: SchemaDescriptionsProps, ref: ForwardedRef<SchemaDescriptionsMethods>) => {
    const methods: SchemaDescriptionsMethods = {};

    useImperativeHandle(ref, () => methods);

    const renderComponent = (schema?: DescriptionsComponentSchema): React.ReactElement => {
      if (!schema) return <></>;

      switch (schema.type) {
        case 'Tabs':
          return (
            <Tabs type="card" {...schema.props}>
              {schema.children?.map((child, index) => (
                <Tabs.TabPane tab={(child.props as TabPaneProps)?.tab} key={index.toString()}>
                  {renderComponent(child)}
                </Tabs.TabPane>
              ))}
            </Tabs>
          );
        case 'TabPane':
          return <>{schema.children?.map((child, index) => renderComponent(child))}</>;
        case 'Card':
          return (
            <Card bordered {...schema.props}>
              {schema.children?.map(renderComponent)}
            </Card>
          );
        case 'Descriptions':
          return (
            <Descriptions {...schema.props}>
              {schema.children?.map((child, index) => renderComponent(child))}
            </Descriptions>
          );
        case 'DescriptionsItem':
          // Descriptions.Item 需要特别处理，因为它需要label和value属性
          return (
            <Descriptions.Item label={schema.props?.label} key={schema.props?.key}>
              {schema.props?.children}
            </Descriptions.Item>
          );
        default:
          return <></>;
      }
    };

    return renderComponent(schema);
  },
);

export default SchemaDescriptions;
