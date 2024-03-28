import { Button, Cascader, Form, Icon, Input, Row, Tooltip } from 'antd';
import React, { useState } from 'react';
import { FrontendFilteredSelect, ModalForm, FrontendFilteredSelectListItem } from 'widgets-v3';
import delay from 'delay';
import rsp from './optionLabelProp.json';
import { SelectValue } from 'antd/es/select';

export default () => {
  const [value, onChange] = useState<SelectValue>();
  return (
    <Row>
      <FrontendFilteredSelect
        value={value}
        onChange={onChange}
        valueFieldName="id"
        labelFieldName={(item) => `${item.value}(${item.code})`}
        placeholder="请选择"
        optionLabelFieldName="value"
        request={async () => {
          await delay(1000);
          return rsp.data;
        }}
      />
      {JSON.stringify(value)}
    </Row>
  );
};
