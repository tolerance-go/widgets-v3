import { Input } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import { SchemaForm } from 'widgets-v3';

const App = () => {
  return (
    <div style={{ margin: '50px' }}>
      <SchemaForm
        schema={[
          {
            type: 'Form',
            props: { layout: 'vertical' },
            children: [
              {
                type: 'Row',
                props: {},
                children: [
                  {
                    type: 'Col',
                    props: { span: 12 },
                    children: [
                      {
                        type: 'FormItem',
                        props: { label: 'First Name', key: 'first-name' },
                        children: [
                          {
                            type: 'FormField',
                            id: 'firstName',
                            options: {
                              rules: [{ required: true, message: 'Please input your first name!' }],
                            },
                            children: {
                              type: 'Node',
                              component: <Input />,
                            },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'Col',
                    props: { span: 12 },
                    children: [
                      {
                        type: 'FormItem',
                        props: { label: 'Last Name', key: 'last-name' },
                        children: [
                          {
                            type: 'FormField',
                            id: 'lastName',
                            options: {
                              rules: [{ required: true, message: 'Please input your last name!' }],
                            },
                            children: {
                              type: 'Node',
                              component: <Input />,
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'FormItem',
                props: { label: 'Email', key: 'email' },
                children: [
                  {
                    type: 'FormField',
                    id: 'email',
                    options: {
                      rules: [
                        { type: 'email', message: 'The input is not valid E-mail!' },
                        { required: true, message: 'Please input your E-mail!' },
                      ],
                    },
                    children: {
                      type: 'Node',
                      component: <Input />,
                    },
                  },
                ],
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default App;
