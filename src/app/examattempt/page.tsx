'use client';
import React, { useState, useEffect } from 'react';
import {
    Form,
    InputNumber,
    Select,
    Table,
    Button,
    message,
    Spin,
    Typography,
    Popconfirm, TableProps
} from 'antd';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '@/firebase/initFirebase';

const { Option } = Select;

// Define the interface for StudentClass
interface StudentClass {
    id: string;
    name: string;
    take1: number | null;
    take2: number | null;
}
// Define the interface for Class
interface Class {
    id: string;
    code: string;
    name: string;
    students: StudentClass[];
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'text' | 'number';
    record: StudentClass;
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
    const inputNode = <InputNumber min={0} max={100} />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: `Vui lòng nhập ${title}` }]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const ExamScoreEntry: React.FC = () => {
    const [form] = Form.useForm();
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [students, setStudents] = useState<StudentClass[]>([]);
    const [editingID, setEditingID] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetch classes from the database
    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            try {
                const classSnapshot = await getDocs(collection(db, 'classes'));
                const classList: Class[] = classSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    code: doc.data().code,
                    name: doc.data().name,
                    students: doc.data().students || [],
                }));
                setClasses(classList);
            } catch (error) {
                message.error('Không thể tải danh sách lớp học.');
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    // Handle class selection
    const handleClassChange = (classId: string) => {
        setSelectedClassId(classId);
        const selectedClass = classes.find(cls => cls.id === classId);
        if (selectedClass) {
            setStudents(selectedClass.students);
        }
    };

    const isEditing = (record: StudentClass) => record.id === editingID;

    const edit = (record: Partial<StudentClass> & { id: React.Key }) => {
        form.setFieldsValue({ ...record });
        setEditingID(record.id as string);
    };

    const cancel = () => {
        setEditingID(null);
    };

    const save = async (id: React.Key) => {
        try {
            const row = (await form.validateFields()) as StudentClass;
            const newData = [...students];
            const index = newData.findIndex((item) => id === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setStudents(newData);
                setEditingID(null);
            }
            message.success('Lưu điểm thành công!');
        } catch (errInfo) {
            message.error('Có lỗi xảy ra khi lưu điểm.');
        }
    };

    const columns = [
        {
            title: 'Mã Sinh Viên',
            dataIndex: 'id',
            width: '20%',
            editable: false,
        },
        {
            title: 'Tên Sinh Viên',
            dataIndex: 'name',
            width: '40%',
            editable: false,
        },
        {
            title: 'Điểm Lần 1',
            dataIndex: 'take1',
            width: '20%',
            editable: true,
        },
        {
            title: 'Điểm Lần 2',
            dataIndex: 'take2',
            width: '20%',
            editable: true,
        },
        {
            title: 'Hành động',
            dataIndex: 'operation',
            render: (_: any, record: StudentClass) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
                            Lưu
                        </Typography.Link>
                        <Popconfirm title="Bạn có chắc muốn hủy bỏ?" onConfirm={cancel}>
                            <a>Hủy</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingID !== null} onClick={() => edit(record)}>
                        Chỉnh sửa
                    </Typography.Link>
                );
            },
        },
    ];

    const mergedColumns: TableProps<StudentClass>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: StudentClass) => ({
                record,
                inputType: 'number',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div>
            <Typography.Title level={4}>Nhập Điểm Kỳ Thi</Typography.Title>
            {loading ? (
                <Spin size="large" />
            ) : (
                <>
                    <Select
                        style={{ width: 300, marginBottom: 16 }}
                        placeholder="Chọn lớp học"
                        onChange={handleClassChange}
                        value={selectedClassId}
                    >
                        {classes.map((cls) => (
                            <Option key={cls.id} value={cls.id}>
                                {cls.name} ({cls.id})
                            </Option>
                        ))}
                    </Select>
                    <Form form={form} component={false}>
                        <Table
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            bordered
                            dataSource={students}
                            columns={mergedColumns}
                            rowClassName="editable-row"
                            pagination={{ pageSize: 5 }}
                            rowKey="id"
                        />
                    </Form>
                    <div style={{ marginTop: 16 }}>
                        <Button type="primary" onClick={() => form.submit()}>
                            Lưu Điểm
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={() => form.resetFields()}>
                            Hủy
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ExamScoreEntry;
