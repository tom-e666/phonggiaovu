'use client';

import React, { useEffect, useState } from 'react';
import {Button, Form, Input, InputNumber, Popconfirm, Spin, Table, TableProps, Typography} from "antd";
import {useAuth} from "@/firebase/initFirebase";
import Link from "next/link";
import Title from "antd/es/typography/Title";

interface Class {
    id: string;
    name: string;
    lecture: string;
    students: string[];
    schedule: { [key: string]: any };
}

const mockData: Class[] = [];
for(let i = 0; i < 100; ++i) {
    mockData.push({
        id: i.toString(),
        name: `Tom ${i}`,
        lecture: `Trang ${i}`,
        students: ['Tom', 'Trang', '@ sẽ được thay thế bằng link'],
        schedule: { [1]: "Thứ ba 7h-9h A111", [2]: "Thứ tư 13h-15h A111" },
    });
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Class;
    index: number;
}

const editableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
                                                                                editing,
                                                                                dataIndex,
                                                                                title,
                                                                                inputType,
                                                                                record,
                                                                                index,
                                                                                children,
                                                                                ...restProps
                                                                            }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[{
                        required: true,
                        message: `Vui lòng nhập ${title}!`,
                    }]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    )
};

function Page() {
    const { user, loading } = useAuth();
    if (loading) {
        return <Spin size="large" />
    }
    if (!user) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
            }}>
                <Title level={2} style={{ marginBottom: '24px', color: '#1677ff' }}>Vui lòng đăng nhập trước khi truy cập nội dung</Title>
                <Link href="/dashboard" passHref>
                    <Button type="primary" size="large">Đăng nhập</Button>
                </Link>
            </div>
        )
    }

    const [form] = Form.useForm();
    const [data, setData] = useState(mockData);
    const [editingID, setEditingID] = useState('');
    const isEditing = (record: Class) => record.id === editingID;

    const edit = (record: Partial<Class> & { id: React.Key }) => {
        form.setFieldsValue({
            name: '',
            lecture: '',
            ...record,
        })
        setEditingID(record.id);
    }

    const cancel = () => {
        setEditingID('');
    }

    const save = async (id: React.Key) => {
        try {
            const row = (await form.validateFields()) as Class;
            const newData = [...data];
            const index = newData.findIndex((item: Class) => id === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
            }
            setData(newData);
            setEditingID('');
        } catch (e) {
            console.log("Xác thực thất bại", e);
        }
    }

    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            width: '20%',
            editable: true,
        },
        {
            title: 'Giảng viên',
            dataIndex: 'lecture',
            width: '20%',
            editable: true,
        },
        {
            title: 'Xem danh sách sinh viên',
            dataIndex: 'students',
            width: '20%',
            editable: false,
            render: (students: string[]) => {
                return students.join(', ')
            }
        },
        {
            title: 'Lịch học',
            dataIndex: 'schedule',
            width: '20%',
            editable: false,
            render: (schedule: { [key: string]: string }) => {
                return Object.values(schedule).join('\n');
            }
        },
        {
            title: 'Thao tác',
            dataIndex: 'operation',
            render: (_: any, record: Class) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => { save(record.id) }} style={{ marginInlineEnd: 8 }}>
                            Lưu
                        </Typography.Link>
                        <Popconfirm title="Bạn có chắc muốn hủy?" onConfirm={cancel}>
                            <a> Hủy</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link
                        disabled={editingID !== ''}
                        onClick={() => { edit(record) }}>
                        Sửa
                    </Typography.Link>
                )
            }
        }
    ];

    const mergedColumns: TableProps<Class>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Class) => ({
                record,
                inputType: col.dataIndex = 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record)
            })
        };
    });

    return (
        <div style={{
            width: '100%',
            height: '100%',
        }}>
            <Form
                form={form}
                component={false}
            >
                <Table
                    components={{
                        body: {
                            cell: editableCell,
                        },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{ onChange: cancel }}
                    scroll={{ y: 'calc(100vh - 300px)' }}
                >
                </Table>
            </Form>
        </div>
    )
}

export default Page;
