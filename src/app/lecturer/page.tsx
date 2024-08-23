'use client'
import React, { useState } from "react";
import { Form, Input, Popconfirm, Table, TableProps, Typography } from "antd";

interface Lecturer {
    lecturerId: string;
    name: string;
    email: string;
    classes: string[];
}

const mockLecturers: Lecturer[] = [];
for (let i = 1; i <= 100; ++i) {
    mockLecturers.push({
        lecturerId: `Lecturer ${i}`,
        name: `Lecturer Name ${i}`,
        email: `lecturer${i}@example.com`,
        classes: ["Class101", "Class102"],
    });
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'text';
    record: Lecturer;
    index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
                                                                                editing,
                                                                                dataIndex,
                                                                                title,
                                                                                inputType,
                                                                                record,
                                                                                index,
                                                                                children,
                                                                                ...restProps
                                                                            }) => {
    const inputNode = <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[{
                        required: true,
                        message: `Please Input ${title}!`,
                    }]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export default function Page() {
    const [form] = Form.useForm();
    const [data, setData] = useState(mockLecturers);
    const [editingID, setEditingID] = useState('');
    const isEditing = (record: Lecturer) => record.lecturerId === editingID;

    const edit = (record: Partial<Lecturer> & { lecturerId: React.Key }) => {
        form.setFieldsValue({
            name: '',
            email: '',
            ...record,
        });
        setEditingID(record.lecturerId as string);
    };

    const cancel = () => {
        setEditingID('');
    };

    const save = async (lecturerId: React.Key) => {
        try {
            const row = (await form.validateFields()) as Lecturer;
            const newData = [...data];
            const index = data.findIndex((record: Lecturer) => record.lecturerId === lecturerId);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingID('');
            }
        } catch (e) {
            console.log('There is a problem with editing rows, see lecturer.tsx', e);
        }
    };

    const columns = [
        {
            title: 'Lecturer ID',
            dataIndex: 'lecturerId',
            width: '20%',
            editable: true,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            width: '20%',
            editable: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '30%',
            editable: true,
        },
        {
            title: 'Classes',
            dataIndex: 'classes',
            width: '20%',
            editable: true,
            render: (classes: string[]) => {
                return classes.join(', ');
            },
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_: any, record: Lecturer) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.lecturerId)} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Are you sure you want to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link
                        disabled={editingID !== ''}
                        onClick={() => edit(record)}
                    >
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];

    const mergedColumns: TableProps<Lecturer>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col;
        } else {
            return {
                ...col,
                onCell: (record: Lecturer) => ({
                    record,
                    inputType: 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: isEditing(record),
                }),
            };
        }
    });

    return (
        <div>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{ onChange: cancel }}
                    scroll={{ y: 'calc(100vh - 300px)' }}
                />
            </Form>
        </div>
    );
}
