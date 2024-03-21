import { Button, Cascader, Form, Icon, Input, Row, Tooltip } from 'antd';
import React from 'react';
import {
  FrontendFilteredSelect,
  ModalForm,
  FrontendFilteredSelectListItem,
  SearchTable,
  Action,
} from 'widgets-v3';
import delay from 'delay';

const generateChildren = (total: number): FrontendFilteredSelectListItem[] => {
  const children: FrontendFilteredSelectListItem[] = [];
  for (let i = 0; i < total; i++) {
    children.push({
      value: i.toString() + i,
      label: i.toString() + i,
    });
  }
  return children;
};

const getPageItems = (
  page: number,
  pageSize: number,
  total: number,
): FrontendFilteredSelectListItem[] => {
  const children = generateChildren(total);
  // 计算开始索引和结束索引
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  // 返回当前页的数组子集
  return children.slice(startIndex, endIndex);
};

export default () => (
  <Row>
    <SearchTable
      columns={[
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          filters: [
            { text: 'Joe', value: 'Joe' },
            { text: 'Jim', value: 'Jim' },
          ],
          sorter: true,
        },
        {
          title: '年龄',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: '住址',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '操作',
          align: 'center',
          render: (record) => {
            return (
              <ModalForm
                title="标题"
                trigger={<Button type="link">修改</Button>}
                renderFormItems={({ form: { getFieldDecorator }, initialFormValues }) => {
                  return [
                    <Form.Item key={'name'} label="姓名">
                      {getFieldDecorator('name', {
                        initialValue: initialFormValues?.name,
                      })(
                        <FrontendFilteredSelect
                          initialList={[
                            {
                              label: record.name,
                              value: record.name,
                            },
                          ]}
                          placeholder="请选择"
                          request={async () => {
                            await delay(1000);
                            return (
                              [
                                {
                                  label: record.name,
                                  value: record.name,
                                },
                              ] as FrontendFilteredSelectListItem[]
                            ).concat(getPageItems(1, 100, 100));
                          }}
                        />,
                      )}
                    </Form.Item>,
                    <Form.Item key={'age'} label="年龄" hasFeedback>
                      {getFieldDecorator('age', {
                        initialValue: initialFormValues?.age,
                        rules: [
                          {
                            required: true,
                          },
                        ],
                      })(<Input autoComplete="off" />)}
                    </Form.Item>,
                    <Form.Item key={'address'} label="住址" hasFeedback>
                      {getFieldDecorator('address', {
                        initialValue: initialFormValues?.address,
                      })(<Input />)}
                    </Form.Item>,
                  ];
                }}
                renderActionGroup={({ toggleModal, form }) => {
                  return [
                    <Action
                      key="btn1"
                      trigger={<Button type="primary">确认</Button>}
                      request={async () => {
                        const formValues = await new Promise((resolve, reject) => {
                          form.validateFieldsAndScroll((errors, values) => {
                            if (errors) {
                              reject('表单存在错误，请检查');
                              return;
                            }
                            resolve(values);
                          });
                        });
                        await delay(1000);

                        console.log(formValues);

                        toggleModal();
                      }}
                    />,
                  ];
                }}
                requestInitialFormValues={async () => {
                  return record;
                }}
              />
            );
          },
        },
      ]}
      searchForm={{
        renderFormItems: ({ form: { getFieldDecorator } }) => {
          return [
            <Form.Item label="E-mail">
              {getFieldDecorator('email', {})(<Input autoComplete="off" />)}
            </Form.Item>,
            <Form.Item label="Password" hasFeedback>
              {getFieldDecorator('password', {
                rules: [],
              })(<Input.Password autoComplete="off" />)}
            </Form.Item>,
            <Form.Item label="Confirm Password" hasFeedback>
              {getFieldDecorator('confirm', {
                rules: [],
              })(<Input.Password />)}
            </Form.Item>,
            <Form.Item
              label={
                <span>
                  Nickname&nbsp;
                  <Tooltip title="What do you want others to call you?">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('nickname', {})(<Input />)}
            </Form.Item>,
          ];
        },
      }}
      request={async (params) => {
        console.log('params', params);
        await delay(1000);
        return {
          total: 100,
          data: [
            {
              key: '1',
              name: '胡彦斌',
              age: 32,
              address: '西湖区湖底公园1号',
            },
            {
              key: '2',
              name: '胡彦祖',
              age: 42,
              address: '西湖区湖底公园1号',
            },
          ],
        };
      }}
    />
  </Row>
);
