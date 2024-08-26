'use client';

import React, {useEffect, useState} from 'react';
import {Button, Form, Input, InputNumber, Popconfirm, Spin, Table, TableProps, Typography} from "antd";
import {db, useAuth} from "@/firebase/initFirebase";
import Link from "next/link";
import {collection, getDocs} from "@firebase/firestore";
import Title from "antd/es/typography/Title";

interface StudentClass {
    id: string;
    name: string;
    take1: number | null;
    take2: number | null;
}

interface Class {
    id: string;
    code: string;
    name: string;
    term: string;
    year: number;
    lecturer?: string;
    lecturerID?: string;
    location?: string;
    schedule?: string[];
    description?: string;
    prerequisites?: string;
    capacity: number;
    students: StudentClass[];
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Class;
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
    );
};

const retrieveClasses = async (): Promise<Class[]> => {
    try {
        const classCollection = collection(db, 'classes');
        const classSnapshot = await getDocs(classCollection);
        return classSnapshot.docs.map(doc => ({
            id: doc.id,
            code: doc.data().code,
            name: doc.data().name,
            term: doc.data().term,
            year: doc.data().year,
            lecturer: doc.data().lecturer,
            lecturerID: doc.data().lecturerID,
            location: doc.data().location,
            schedule: doc.data().schedule || [],
            description: doc.data().description,
            prerequisites: doc.data().prerequisites,
            capacity: doc.data().capacity,
            students: doc.data().students || []
        }));
    } catch (error) {
        console.error("Failed to retrieve classes:", error);
        return [];
    }
};

function Page() {
    const { user, loading } = useAuth();
    const [form] = Form.useForm();
    const [data, setData] = useState<Class[]>([]);
    const [editingID, setEditingID] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const classData = await retrieveClasses();
                setData(classData);
            } catch (e) {
                console.error('Failed to load class data:', e);
            }
        };
        load();
    }, []);

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
                <Link href="/login" passHref>
                    <Button type="primary" size="large">Đăng nhập</Button>
                </Link>
            </div>
        )
    }

    const isEditing = (record: Class) => record.id === editingID;

    const edit = (record: Partial<Class> & { id: React.Key }) => {
        form.setFieldsValue({ ...record });
        setEditingID(record.id as string);
    };

    const cancel = () => {
        setEditingID(null);
    };

    const save = async (id: React.Key) => {
        try {
            const row = (await form.validateFields()) as Class;
            const newData = [...data];
            const index = newData.findIndex((item) => id === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                setEditingID(null);
            }
        } catch (e) {
            console.log("Có vấn đề khi chỉnh sửa hàng:", e);
        }
    };

    const columns = [
        {
            title: 'Mã',
            dataIndex: 'id',
            width: '10%',
            editable: false,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            width: '20%',
            editable: true,
        },
        {
            title: 'Học kỳ',
            dataIndex: 'term',
            width: '10%',
            editable: true,
        },
        {
            title: 'Năm học',
            dataIndex: 'year',
            width: '10%',
            editable: true,
        },
        {
            title: 'Giảng viên',
            dataIndex: 'lecturer',
            width: '15%',
            editable: true,
            render: (text: string | undefined) => text || 'N/A',
        },
        {
            title: 'Phòng học',
            dataIndex: 'location',
            width: '10%',
            editable: true,
            render: (text: string | undefined) => text || 'N/A',
        },
        {
            title: 'Lịch học',
            dataIndex: 'schedule',
            width: '15%',
            editable: false,
            render: (schedule: string[] | undefined) => schedule ? schedule.join(', ') : 'N/A',
        },
        {
            title: 'Thao tác',
            dataIndex: 'operation',
            render: (_: any, record: Class) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
                            Lưu
                        </Typography.Link>
                        <Popconfirm title="Bạn có chắc muốn hủy?" onConfirm={cancel}>
                            <a> Hủy</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link
                        disabled={editingID !== null}
                        onClick={() => edit(record)}>
                        Sửa
                    </Typography.Link>
                );
            },
        },
    ];

    const mergedColumns: TableProps<Class>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Class) => ({
                record,
                inputType: col.dataIndex === 'year' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record)
            })
        };
    });

    return (
        <div style={{ width: '100%', height: '100%' }}>
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

export default Page;
