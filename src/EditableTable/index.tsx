import React, { useState, useContext, useMemo, Dispatch, SetStateAction, useCallback } from 'react';
import { Table, Input, Button, Popconfirm, Form, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { GetFieldDecoratorOptions, WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps, TableProps } from 'antd/lib/table';
import useUpdateEffect from '../_utils/useUpdateEffect';

const OPERATION_DATA_INDEX = 'Editable_operation';

type RecordType = Record<string, any>;

type EditableRowContextType = {
  form: WrappedFormUtils;
  setEditing: (editing: boolean) => void;
  editing: boolean;
};

const EditableRowContext = React.createContext<EditableRowContextType | null>(null);

interface EditableRowProps<T> extends FormComponentProps {
  index: number;
  record: T;
  tableRowKey: React.Key;
}

interface EditableCellProps {
  editable?: boolean;
  children?: React.ReactNode;
  dataIndex?: React.Key;
  record: RecordType;
  index: number;
  key?: React.Key;
  fieldDecoratorOptions?: GetFieldDecoratorOptions;
  renderInput?: (
    val: any,
    record: RecordType,
    index: number,
    form: WrappedFormUtils,
  ) => React.ReactNode;
}

type EditableTableProps<T> = {
  value?: T[];
  onChange?: (data: T[]) => void;
  initialData?: T[];
  columns?: ExtendedColumnProps<T>[];
  // 因为有内部的新增行，所以需要规定静态的 key 字段表示唯一 id
  rowKey?: string | number;
} & Omit<TableProps<T>, 'columns' | 'rowKey'>;

// 扩展 ColumnProps 接口来添加额外的属性
interface ExtendedColumnProps<T> extends ColumnProps<T> {
  editable?: boolean;
  fieldDecoratorOptions?: GetFieldDecoratorOptions;
  renderInput?: EditableCellProps['renderInput'];
}

type EditableRowEditingContextType = {
  editingRowIds: Record<string, boolean>;
  setEditingRowIds: Dispatch<SetStateAction<{}>>;
};

const EditableRowEditingContext = React.createContext<EditableRowEditingContextType>({
  editingRowIds: {},
  setEditingRowIds: () => {},
});

// 编辑行组件
const EditableRow = <T extends RecordType = RecordType>({
  form,
  wrappedComponentRef,
  index,
  record,
  // 叫 rowKey 内部会被过滤
  tableRowKey,
  ...props
}: EditableRowProps<T>) => {
  console.log(form, index, record, tableRowKey);

  const { editingRowIds, setEditingRowIds } = useContext(EditableRowEditingContext);

  const rowId = record[tableRowKey];

  const editing = editingRowIds[rowId];

  const setEditing = useCallback(
    (editing: boolean) => {
      setEditingRowIds((prev) => ({ ...prev, [rowId]: editing }));
    },
    [rowId],
  );

  const rowContext = useMemo(() => {
    return {
      form,
      editing,
      setEditing,
    };
  }, [form, editing, setEditing]);

  return (
    <EditableRowContext.Provider value={rowContext}>
      <tr {...props} />
    </EditableRowContext.Provider>
  );
};

const EditableFormRow = Form.create()(EditableRow);

// 可编辑单元格组件
const EditableCell = ({
  dataIndex,
  key,
  record,
  index,
  children,
  renderInput,
  editable,
  fieldDecoratorOptions,
  ...restProps
}: EditableCellProps) => {
  return (
    <EditableRowContext.Consumer>
      {(rowContext) => {
        const { form, editing } = rowContext!;
        const { getFieldDecorator } = form;

        let field = dataIndex ?? key;

        if (!editable || dataIndex === OPERATION_DATA_INDEX) {
          return <td {...restProps}>{children}</td>;
        }

        if (editing && !field) {
          throw new Error('表单输入项缺少 dataIndex 或者 key');
        }

        return (
          <td {...restProps}>
            {editing ? (
              <Form.Item style={{ margin: 0 }}>
                {getFieldDecorator(field!, {
                  initialValue: record[field!],
                  ...fieldDecoratorOptions,
                })(renderInput?.(record[field!], record, index, form) ?? <Input />)}
              </Form.Item>
            ) : (
              children
            )}
          </td>
        );
      }}
    </EditableRowContext.Consumer>
  );
};

const defaultRowKey = 'key';

// 主组件
const EditableTable = <T extends Record<string, any> = Record<string, any>>({
  initialData = [],
  rowKey = defaultRowKey,
  columns = [],
  value,
  onChange,
  ...restTableProps
}: EditableTableProps<T>) => {
  const [dataSource, setDataSource] = useState<T[]>(value ?? initialData);
  const [editingRowIds, setEditingRowIds] = useState<Record<string, boolean>>({});

  useUpdateEffect(() => {
    onChange?.(dataSource)
  }, [dataSource]);

  const editableRowEditingContext: EditableRowEditingContextType = useMemo(() => {
    return {
      editingRowIds,
      setEditingRowIds,
    };
  }, [editingRowIds, setEditingRowIds]);

  const save = (
    form: WrappedFormUtils,
    record: T,
    rowIndex: number,
    setEditing: EditableRowContextType['setEditing'],
  ) => {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...dataSource];
      const rowId = record[rowKey];
      const index = newData.findIndex((item, index) => rowId === item[rowKey]);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDataSource(newData);
        setEditing(false);
      }
    });
  };

  const handleDelete = (key: string) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleAdd = (position: 'bottom' | 'top' = 'bottom') => {

    if (Object.entries(editingRowIds).some(item => item[1])) {
      message.warn('有正在编辑的行，请先保存')
      return;
    }

    const newData = {} as T;
    const rowId = Date.now();
    const newDataWithKey = {
      [rowKey]: rowId,
      ...newData,
    };
    setDataSource(
      position === 'bottom' ? [...dataSource, newDataWithKey] : [newDataWithKey, ...dataSource],
    );
    setEditingRowIds((prev) => ({ ...prev, [rowId]: true })); // Directly go to edit mode
  };

  const mergedColumns = columns
    .concat([
      {
        title: '操作',
        dataIndex: OPERATION_DATA_INDEX,
        render: (text: any, record: T, index: number) => {
          return (
            <span>
              <EditableRowContext.Consumer>
                {(rowContext) => {
                  const { form, editing, setEditing } = rowContext!;
                  const { getFieldDecorator } = form;
                  const rowId = record[rowKey];

                  return editing ? (
                    <>
                      <Button
                        size="small"
                        type="link"
                        style={{ marginRight: 8 }}
                        onClick={() => {
                          save(form, record, index, setEditing);
                        }}
                      >
                        保存
                      </Button>
                      <Popconfirm
                        title="确认取消吗？"
                        cancelText="取消"
                        okText="确认"
                        onConfirm={() => {
                          setEditing(false);
                        }}
                      >
                        <Button size="small" type="link">
                          取消
                        </Button>
                      </Popconfirm>
                    </>
                  ) : (
                    <>
                      <Button
                        size="small"
                        type="link"
                        style={{ marginRight: 8 }}
                        onClick={() => setEditing(true)}
                      >
                        编辑
                      </Button>
                      <Popconfirm
                        title="确认删除吗？"
                        cancelText="取消"
                        okText="确认"
                        onConfirm={() => handleDelete(rowId)}
                      >
                        <Button size="small" type="link">
                          删除
                        </Button>
                      </Popconfirm>
                    </>
                  );
                }}
              </EditableRowContext.Consumer>
            </span>
          );
        },
      },
    ])
    .map((col): ExtendedColumnProps<T> => {
      return {
        ...col,
        onCell: (record: T, index: number): EditableCellProps => ({
          ...col.onCell?.(record, index),
          record,
          dataIndex: col.dataIndex,
          editable: col.editable,
          key: col.key,
          index,
          fieldDecoratorOptions: col.fieldDecoratorOptions,
          renderInput: col.renderInput,
        }),
      };
    });

  return (
    <EditableRowEditingContext.Provider value={editableRowEditingContext}>
      <Form>
        <Table
          {...restTableProps}
          onRow={(record, index) => {
            return {
              record,
              index,
              tableRowKey: rowKey,
            };
          }}
          components={{
            body: {
              row: EditableFormRow,
              cell: EditableCell,
            },
            table: (props) => (
              <>
                <Button
                  block
                  type="dashed"
                  onClick={() => handleAdd('top')}
                  style={{ marginBottom: 8 }}
                >
                  首部添加一行数据
                </Button>
                <table {...props}></table>
                <Button
                  block
                  type="dashed"
                  onClick={() => handleAdd('bottom')}
                  style={{ marginTop: 8 }}
                >
                  尾部添加一行数据
                </Button>
              </>
            ),
          }}
          bordered
          dataSource={dataSource}
          columns={mergedColumns}
          // pagination={false}
          pagination={{
            showTotal: (total, range) => `共 ${total} 条记录`,
          }}
        />
      </Form>
    </EditableRowEditingContext.Provider>
  );
};

export default EditableTable;
