import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Form, Icon, Input, Popconfirm, Table, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { GetFieldDecoratorOptions, WrappedFormUtils } from 'antd/es/form/Form';
import { ColumnProps, TableProps } from 'antd/es/table';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  style?: React.CSSProperties;
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
  selectedRowFieldName?: string;
  sortable?: boolean;
  editable?: boolean;
} & Omit<TableProps<T>, 'columns' | 'rowKey' | 'onChange'>;

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

function DragHandle({ id, disabled }: { id: string; disabled?: boolean }) {
  const { attributes, listeners, setNodeRef } = useSortable({
    id,
    disabled,
  });

  const style = {
    cursor: disabled ? 'not-allowed' : 'grab',
    color: disabled ? '#ccc' : 'inherit', // 灰色表示禁用状态
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <Icon type="menu" style={{ fontSize: '16px' }} />
    </div>
  );
}

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
  const rowId = record[tableRowKey];

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: rowId.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: 'transform 100ms ease',
  };

  const { editingRowIds, setEditingRowIds } = useContext(EditableRowEditingContext);

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
      <tr {...props} ref={setNodeRef} style={{ ...props.style, ...style }} />
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
                })(renderInput?.(record[field!], record, index, form) ?? <Input autoFocus />)}
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

const defaultPageSize = 10;

// 主组件
const EditableTable = <T extends Record<string, any> = Record<string, any>>({
  initialData = [],
  rowKey = defaultRowKey,
  columns = [],
  value,
  onChange,
  rowSelection: externalRowSelection,
  selectedRowFieldName = 'rowSelected',
  sortable = true,
  editable = true,
  ...restTableProps
}: EditableTableProps<T>) => {
  const [dataSource, setDataSource] = useState<T[]>(value ?? initialData);

  // 初始化选中行的状态
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>(() => {
    // 假设 dataSource 中某个属性（如 $rowSelected）表示该行初始时是否选中
    return dataSource.filter((item) => item[selectedRowFieldName]).map((item) => item[rowKey]);
  });

  const [editingRowIds, setEditingRowIds] = useState<Record<string, boolean>>({});

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => {
    if (restTableProps.pagination !== false) {
      return restTableProps.pagination?.defaultPageSize ?? defaultPageSize;
    }

    return defaultPageSize;
  }); // 假设初始每页显示10条，根据需要调整

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragEnd = useCallback(
    (event) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = dataSource.findIndex((item) => item[rowKey] === active.id);
        const newIndex = dataSource.findIndex((item) => item[rowKey] === over.id);
        const newData = arrayMove([...dataSource], oldIndex, newIndex);
        setDataSource(newData);
        onChange?.(newData);
      }
    },
    [dataSource],
  );

  useUpdateEffect(() => {
    onChange?.(dataSource);
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

  const handleAdd = (position: 'top' | 'bottom' = 'bottom') => {
    if (Object.entries(editingRowIds).some(([_, editing]) => editing)) {
      message.warn('有正在编辑的行，请先保存');
      return;
    }

    // Create a new data item with a unique ID
    const newDataItem = {} as T;
    const rowId = Date.now().toString(); // 使用时间戳作为唯一ID
    const newDataItemWithKey: T = { ...newDataItem, [rowKey]: rowId };

    let newData: T[];

    if (position === 'bottom') {
      // Add the new data item at the end of the dataSource
      newData = [...dataSource, newDataItemWithKey];
    } else {
      // Add the new data item at the beginning of the dataSource and move to the first page
      newData = [newDataItemWithKey, ...dataSource];
    }

    setDataSource(newData);
    setEditingRowIds((prev) => ({ ...prev, [rowId]: true })); // 新增行直接进入编辑状态

    if (position === 'bottom') {
      // If adding at the bottom and the current page is not the last one, navigate to the new last page
      const newTotalPages = Math.ceil(newData.length / pageSize);
      if (currentPage < newTotalPages) {
        setCurrentPage(newTotalPages);
      }
    } else {
      if (currentPage !== 1) {
        setCurrentPage(1); // Ensure we navigate back to the first page when adding a row at the top
      }
    }
  };

  const handleInsertRow = (position: 'above' | 'below', insertRowId: string) => {
    if (Object.entries(editingRowIds).some(([_, editing]) => editing)) {
      message.warn('有正在编辑的行，请先保存');
      return;
    }

    const index = dataSource.findIndex((item) => item[rowKey].toString() === insertRowId);
    if (index === -1) {
      console.error('Row not found');
      return;
    }

    const newDataItem = {} as T;
    const rowId = Date.now().toString(); // 使用时间戳作为唯一ID
    const newDataItemWithKey = { [rowKey]: rowId, ...newDataItem };
    const newData = [...dataSource];

    if (position === 'above') {
      newData.splice(index, 0, newDataItemWithKey);
    } else {
      newData.splice(index + 1, 0, newDataItemWithKey);
    }

    setDataSource(newData);
    setEditingRowIds((prev) => ({ ...prev, [rowId]: true }));

    if (position === 'below') {
      // 特殊处理：如果是在当前页的最后一项之后插入，则考虑是否需要翻页
      const isInsertAtCurrentPageBottom =
        (index + 1) % pageSize === 0 && index < dataSource.length - 1;
      if (isInsertAtCurrentPageBottom) {
        const newPage = currentPage + 1;
        setCurrentPage(newPage); // 翻至下一页
      }
    }
  };

  const handleCopy = (copyRowId: React.Key) => {
    if (Object.entries(editingRowIds).some(([_, editing]) => editing)) {
      message.warn('有正在编辑的行，请先保存');
      return;
    }

    const index = dataSource.findIndex((item) => item[rowKey].toString() === copyRowId);
    if (index === -1) {
      console.error('Row not found');
      return;
    }

    const newDataItem = { ...dataSource[index] }; // 复制当前行数据
    const rowId = Date.now().toString(); // 为复制的行生成一个新的唯一ID
    const newDataItemWithKey = { ...newDataItem, [rowKey]: rowId };

    const newData = [...dataSource];
    newData.splice(index + 1, 0, newDataItemWithKey); // 将复制的行插入到当前行的下方

    setDataSource(newData);
    setEditingRowIds((prev) => ({ ...prev, [rowId]: true })); // 新复制的行直接进入编辑状态

    // 特殊处理：如果是在当前页的最后一项之后插入，则考虑是否需要翻页
    const isInsertAtCurrentPageBottom =
      (index + 1) % pageSize === 0 && index < newData.length - 1;
    if (isInsertAtCurrentPageBottom) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage); // 翻至下一页
    }
  };

  const operationColumn: ExtendedColumnProps<T> = {
    title: '操作',
    dataIndex: OPERATION_DATA_INDEX,
    align: 'center',
    render: (text: any, record: T, index: number) => {
      return (
        <EditableRowContext.Consumer>
          {(rowContext) => {
            const { form, editing, setEditing } = rowContext!;
            const { getFieldDecorator } = form;
            const rowId = record[rowKey].toString();

            return !editing ? (
              <>
                <Button
                  size="small"
                  type="link"
                  style={{ marginRight: 8 }}
                  onClick={() => setEditing(true)}
                >
                  编辑
                </Button>
                {/* <Button
                  size="small"
                  type="link"
                  style={{ marginRight: 8 }}
                  onClick={() => handleInsertRow('above', rowId)}
                >
                  上方插入
                </Button>
                <Button
                  size="small"
                  type="link"
                  style={{ marginRight: 8 }}
                  onClick={() => handleInsertRow('below', rowId)}
                >
                  下方插入
                </Button> */}
                <Button
                  size="small"
                  type="link"
                  style={{ marginRight: 8 }}
                  onClick={() => handleCopy(rowId)}
                >
                  复制
                </Button>
                <Popconfirm
                  title="确认删除吗？"
                  cancelText="取消"
                  okText="确认"
                  onConfirm={() => handleDelete(record[rowKey])}
                >
                  <Button size="small" type="link">
                    删除
                  </Button>
                </Popconfirm>
              </>
            ) : (
              <>
                <Button
                  size="small"
                  type="link"
                  style={{ marginRight: 8 }}
                  onClick={() => save(form, record, index, setEditing)}
                >
                  保存
                </Button>
                <Popconfirm
                  title="确认取消吗？"
                  cancelText="取消"
                  okText="确认"
                  onConfirm={() => setEditing(false)}
                >
                  <Button size="small" type="link">
                    取消
                  </Button>
                </Popconfirm>
              </>
            );
          }}
        </EditableRowContext.Consumer>
      );
    },
  };

  const mergedColumns = (
    sortable
      ? [
          {
            title: '排序', // 拖拽手柄列没有标题
            dataIndex: 'dragHandle',
            width: 70, // 根据需要调整宽度
            align: 'center',
            render: (text, record) => (
              <EditableRowContext.Consumer>
                {(rowContext) => {
                  const { form, editing, setEditing } = rowContext!;

                  return <DragHandle disabled={editing} id={record[rowKey].toString()} />; // 使用DragHandle组件
                }}
              </EditableRowContext.Consumer>
            ),
          } as ExtendedColumnProps<T>,
          ...columns,
        ]
      : columns
  )
    .concat(editable ? [operationColumn] : [])
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

  const externalRowSelectionRef = useRef(externalRowSelection);

  useEffect(() => {
    externalRowSelectionRef.current = externalRowSelection;
  }, [externalRowSelection]);

  // 处理行选择改变
  const handleRowSelectionChange = useCallback(
    (selectedRowKeys: string[] | number[], selectedRows: T[]) => {
      setSelectedRowKeys(selectedRowKeys);

      // 更新 dataSource 中的 $rowSelected 状态
      const newData = dataSource.map((item) => {
        const isSelected = (selectedRowKeys as React.Key[]).includes(item[rowKey]);
        return { ...item, [selectedRowFieldName]: isSelected };
      });
      setDataSource(newData);

      // 如果有外部传入的 rowSelection.onChange，则调用
      externalRowSelectionRef.current?.onChange?.(
        selectedRowKeys as number[] | string[],
        selectedRows,
      );
    },
    [dataSource, rowKey],
  );

  // 定义 rowSelection 对象
  const rowSelection = useMemo(() => {
    if (!externalRowSelectionRef.current) return undefined;
    return {
      selectedRowKeys: selectedRowKeys,
      onChange: handleRowSelectionChange,
    };
  }, [selectedRowKeys, handleRowSelectionChange]);

  return (
    <EditableRowEditingContext.Provider value={editableRowEditingContext}>
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <SortableContext items={dataSource.map((data) => data[rowKey]?.toString())}>
          <Form>
            <Table
              {...restTableProps}
              rowSelection={rowSelection}
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
                    {editable && (
                      <Button
                        block
                        type="dashed"
                        onClick={() => handleAdd('top')}
                        style={{ marginBottom: 8 }}
                      >
                        首部添加一行数据
                      </Button>
                    )}
                    <table {...props}></table>
                    {editable && (
                      <Button
                        block
                        type="dashed"
                        onClick={() => handleAdd('bottom')}
                        style={{ marginTop: 8 }}
                      >
                        尾部添加一行数据
                      </Button>
                    )}
                  </>
                ),
              }}
              bordered
              dataSource={dataSource}
              columns={mergedColumns}
              onChange={(pagination) => {
                const { current, pageSize } = pagination;

                setCurrentPage(current ?? 1);

                setPageSize(
                  pageSize ??
                    (restTableProps.pagination !== false
                      ? restTableProps.pagination?.defaultPageSize ?? defaultPageSize
                      : defaultPageSize),
                );
              }}
              // pagination={false}
              pagination={
                restTableProps.pagination === false
                  ? false
                  : {
                      ...restTableProps.pagination,
                      current: currentPage,
                      pageSize: pageSize,
                      showSizeChanger: true,
                      pageSizeOptions: [
                        '10',
                        '20',
                        '30',
                        '40',
                        '50',
                        '60',
                        '70',
                        '80',
                        '90',
                        '100',
                      ],
                      showTotal: (total, range) => `共 ${total} 条记录`,
                    }
              }
            />
          </Form>
        </SortableContext>
      </DndContext>
    </EditableRowEditingContext.Provider>
  );
};

export default EditableTable;
