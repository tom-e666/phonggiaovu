'use client'
import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Popconfirm, Spin, Table, TableProps, Typography } from "antd";
import { useAuth } from "@/firebase/initFirebase";
import Link from "next/link";
import Title from "antd/es/typography/Title";
import { createLecturer, deleteLecturer, readLectures, updateLecturer } from "@/app/lecturer/crud";

interface Lecturer {
    lecturerId: string;
    name: string;
    email: string;

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

// Main Page component
export default function Page() {
    const { user, loading } = useAuth();
    const [form] = Form.useForm();
    const [data, setData] = useState<Lecturer[]>([]);
    const [editingID, setEditingID] = useState<string | null>(null);

    // Fetch lecturers on component mount
    useEffect(() => {
        const fetchLecturers = async () => {
            try {
                const lecturers = await readLectures();
                setData(lecturers);
            } catch (error) {
                message.error('Không thể tải dữ liệu giảng viên');
                console.error('Lỗi khi tải dữ liệu giảng viên:', error);
            }
        };
        fetchLecturers();
    }, []);

    // Handling loading and user state
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

    // Check if a record is currently being edited
    const isEditing = (record: Lecturer) => record.lecturerId === editingID;

    // Edit a lecturer
    const edit = (record: Partial<Lecturer> & { lecturerId: React.Key }) => {
        form.setFieldsValue({
            name: '',
            email: '',
            ...record,
        });
        setEditingID(record.lecturerId as string);
    };

    // Cancel editing
    const cancel = () => {
        setEditingID(null);
    };

    // Save changes to a lecturer
    const save = async (lecturerId: React.Key) => {
        try {
            const row = (await form.validateFields()) as Lecturer;
            const newData = [...data];
            const index = newData.findIndex((record: Lecturer) => record.lecturerId === lecturerId);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingID(null);
                await updateLecturer(lecturerId as string, newData[index]); // Update lecturer in the database
                message.success("Lưu thành công");
            }
        } catch (e) {
            message.error('Có vấn đề khi lưu dữ liệu');
            console.log('Có vấn đề khi chỉnh sửa hàng, xem lecturer.tsx', e);
        }
    };

    // Delete a lecturer
    const deleteLecturerHandler = async (lecturerId: string) => {
        try {
            await deleteLecturer(lecturerId);
            setData(data.filter(item => item.lecturerId !== lecturerId)); // Remove from UI
            message.success("Xóa thành công");
        } catch (error) {
            message.error('Có vấn đề khi xóa dữ liệu');
            console.error('Error deleting lecturer:', error);
        }
    };

    // Define table columns
    const columns = [
        {
            title: 'Mã Giảng Viên',
            dataIndex: 'lecturerId',
            width: '20%',
            editable: true,
        },
        {
            title: 'Tên',
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
            title: 'Thao tác',
            dataIndex: 'operation',
            render: (_: any, record: Lecturer) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.lecturerId)} style={{ marginRight: 8 }}>
                            Lưu
                        </Typography.Link>
                        <Popconfirm title="Bạn có chắc muốn hủy?" onConfirm={cancel}>
                            <a>Hủy</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <div>
                        <Typography.Link
                            disabled={editingID !== null}
                            onClick={() => edit(record)}
                        >
                            Sửa
                        </Typography.Link>
                        <Typography.Link
                            disabled={editingID !== null}
                            onClick={() => deleteLecturerHandler(record.lecturerId)}
                            style={{ marginLeft: '10px' }}
                        >
                            Xóa
                        </Typography.Link>
                    </div>
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
