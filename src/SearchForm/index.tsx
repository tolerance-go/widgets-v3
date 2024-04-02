import React, { useState } from 'react';
import { Form, Row, Col, Button, Icon } from 'antd';
import * as PropTypes from 'prop-types';
import { FormComponentProps, WrappedFormUtils } from 'antd/es/form/Form';
import './index.less';
import { FormProps } from 'antd/es/form';
import { classNames } from '../_utils/classNames';

export type SearchFormItem = {
  node: PropTypes.ReactNodeLike;
  span?: number;
};

export type SearchFormProps = {
  defaultFieldCount?: number;
  itemSpan?: number;
  renderFormItems?: ({
    form,
  }: {
    form: WrappedFormUtils;
  }) => (PropTypes.ReactNodeLike | SearchFormItem)[];
  onSearch?: (values: Record<string, any>) => void;
  onReset?: () => void;
  onValuesChange?: (changedValues: Record<string, any>, allValues: Record<string, any>) => void;
} & FormProps;

export type AdvancedSearchFormProps = SearchFormProps & FormComponentProps;

const AdvancedSearchFormInner: React.FC<AdvancedSearchFormProps> = ({
  form,
  defaultFieldCount = 2,
  renderFormItems,
  itemSpan = 8,
  onSearch,
  onReset,
  ...restFormProps
}) => {
  const [expand, setExpand] = useState<boolean>(false);

  const renderItems = () => {
    if (!renderFormItems) {
      return []; // 或者返回一个默认的表单项
    }

    let items = renderFormItems({ form });
    const count = expand ? items.length : defaultFieldCount;

    return items.map((item, index) => {
      let node, span;

      if (React.isValidElement(item)) {
        // Check if item is a React node
        node = item;
        span = itemSpan; // Default span
      } else if (
        typeof item === 'object' &&
        item !== null &&
        (item as Partial<SearchFormItem>).node
      ) {
        const rightItem = item as SearchFormItem;
        // Check if item is an object with a node field
        node = rightItem.node;
        span = rightItem.span || itemSpan; // Use provided span or default to 8
      } else {
        return null; // Skip invalid items
      }

      return (
        <Col span={itemSpan} key={index} style={{ display: index < count ? 'block' : 'none' }}>
          {node}
        </Col>
      );
    });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.validateFields((err: any, values: any) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        onSearch?.(values);
      }
    });
  };

  const handleReset = () => {
    form.resetFields();
    onReset?.();
  };

  const toggleExpand = () => {
    setExpand(!expand);
  };

  const items = renderItems(); // 调用renderItems来生成项

  // Calculate the total span used by all items regardless of their visibility
  const totalSpanUsed = items
    .filter((item) => item?.props.style.display !== 'none')
    .reduce((acc, curr) => acc + (curr ? curr.props.span : 0), 0);

  // Calculate the remaining span in the last row
  // const rowsUsed = Math.ceil(totalSpanUsed / 24);
  const lastRowSpanUsed = totalSpanUsed % 24;
  const spanLeft = lastRowSpanUsed === 0 ? 0 : 24 - lastRowSpanUsed;

  // Adjust button position based on the remaining span
  const buttonSpan = spanLeft > 0 ? spanLeft : 24;

  return (
    <Form
      layout="horizontal"
      labelCol={{
        span: 6,
      }}
      wrapperCol={{
        span: 18,
      }}
      {...restFormProps}
      className={classNames('wg-search-form', restFormProps.className)}
      onSubmit={handleSearch}
    >
      <Row gutter={24}>
        {items}
        {
          <Col span={buttonSpan} style={{ textAlign: 'right' }}>
            <Form.Item className="wg-search-form-action-form-item">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                重置
              </Button>
              {defaultFieldCount < items.length && (
                <a style={{ marginLeft: 8, fontSize: 12 }} onClick={toggleExpand}>
                  {expand ? (
                    <span>
                      收起 <Icon type="up" />
                    </span>
                  ) : (
                    <span>
                      展开 <Icon type="down" />
                    </span>
                  )}
                </a>
              )}
            </Form.Item>
          </Col>
        }
      </Row>
    </Form>
  );
};

const WrappedAdvancedSearchForm = Form.create<AdvancedSearchFormProps>({
  name: 'SearchForm',
  onValuesChange(props, changedValues, allValues) {
    props.onValuesChange?.(changedValues, allValues);
  },
})(AdvancedSearchFormInner);

export default WrappedAdvancedSearchForm;
