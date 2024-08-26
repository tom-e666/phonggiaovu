'use client'
import React, { useEffect, useState } from "react";
import {Button, Form, Input, InputNumber, message, Popconfirm, Spin, Table, TableProps, Typography} from "antd";
import { useAuth, db } from "@/firebase/initFirebase";
import Link from "next/link";
import {collection, doc, getDocs, updateDoc} from "@firebase/firestore";

const { Title } = Typography;

interface Student {
    id: string;
    name: string;
    email?: string;
    faculty: string;
    birth: string;
    gender?: 'male' | 'female' | 'other';
    phoneNumber?: string;
    address?: string;
    enrolledClasses?: string[];
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Student;
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
                    rules={[
                        { required: true, message: `Vui lòng nhập ${title}!` },
                        dataIndex === 'birth'
                            ? {
                                pattern: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
                                message: 'Ngày Sinh phải theo định dạng dd/mm/yyyy!',
                            }
                            : {},
                    ]}
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
    const { user, loading } = useAuth();
    const [form] = Form.useForm();
    const [studentData, setStudentData] = useState<Student[]>([]);
    const [editingID, setEditingID] = useState<string | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentCollection = collection(db, 'students');
                const studentSnapshot = await getDocs(studentCollection);
                const studentData = studentSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Student[];
                setStudentData(studentData);
            } catch (error) {
                console.error("Error fetching student data:", error);
            }
        };

        fetchData();
    }, []);

    const isEditing = (record: Student) => record.id === editingID;

    const edit = (record: Partial<Student> & { id: React.Key }) => {
        form.setFieldsValue({
            ...record
        });
        setEditingID(record.id as string);
    };

    const cancel = () => {
        setEditingID(null);
    };

    const save = async (id: React.Key) => {
        try {
            // Validate the form and get the updated data
            const row = (await form.validateFields()) as Student;

            // Find the index of the student in the local state
            const newData = [...studentData];
            const index = newData.findIndex((item) => id === item.id);

            if (index > -1) {
                const item = newData[index];
                const updatedItem = { ...item, ...row };

                // Update the local state
                newData.splice(index, 1, updatedItem);
                setStudentData(newData);
                setEditingID(null);

                // Push the update to Firestore
                const studentDocRef = doc(db, "students", id as string);
                await updateDoc(studentDocRef, updatedItem);
                message.success("Cập nhật thành công!");
                console.log("Document successfully updated!");
            } else {
                console.error("Failed to find the student in the local state.");
            }
        } catch (e) {
            message.error(" Cập nhật thất bại");
            console.error("Có vấn đề khi chỉnh sửa hàng:", e);
        }
    };
    const columns = [
        {
            title: 'Mã Sinh Viên',
            dataIndex: 'id',
            width: '10%',
            editable: false,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            width: '15%',
            editable: true,
        },
        {
            title: 'Ngày Sinh',
            dataIndex: 'birth',
            width: '12%',
            editable: true,
        },
        {
            title: 'Giới Tính',
            dataIndex: 'gender',
            width: '9%',
            editable: true,
            render: (gender: string) => gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'N/A',
        },
        {
            title: 'Khoa',
            dataIndex: 'faculty',
            width: '10%',
            editable: false,
        },
        {
            title: 'Địa Chỉ',
            dataIndex: 'address',
            width: '30%',
            editable: true,
        },
        {
            title: 'Thao tác',
            dataIndex: 'operation',
            render: (_: any, record: Student) => {
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
            }
        }
    ];
    const mergedColumns: TableProps<Student>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Student) => ({
                record,
                inputType: col.dataIndex === 'birth' ? 'text' : 'text', // Handle specific field input types
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    if (loading) {
        return <Spin size="large" />;
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
        );
    }

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
                    dataSource={studentData}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{ onChange: cancel }}
                    scroll={{ y: 'calc(100vh - 300px)' }}
                />
            </Form>
        </div>
    );
}
