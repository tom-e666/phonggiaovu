'use client'
import React, { useState } from "react";
import {Form, Input, DatePicker, InputNumber, Popconfirm, Table, TableProps, Typography, Spin, Button} from "antd";
import {useAuth} from "@/firebase/initFirebase";
import Link from "next/link";
import Title from "antd/es/typography/Title";

// Define the ExamScheduler interface
interface ExamScheduler {
    id: string;  // Unique identifier for the exam schedule
    classId: string;  // Combined field that includes class ID, year, and class index
    examName: string;  // Name of the exam, e.g., "Final Exam"
    attemptNumber: number; // Attempt number (1 for first attempt, 2 for second attempt, etc.)
    startTime: string;  // Start time in "HH:mm DD/MM/YYYY" format
    endTime: string;    // End time in "HH:mm DD/MM/YYYY" format
    location: string;
    invigilators: string[];
}

// Generate the unique classId using year, class index, and class name
const generateClassId = (baseClassId: string, year: string, classIndex: string) => {
    return `${baseClassId}_${year}_Class${classIndex}`;
};

// Generate the unique exam ID using classId and attempt number
const generateExamID = (classId: string, attemptNumber: number) => {
    return `${classId}_Attempt${attemptNumber}`;
};

// Mock data for exam schedules
const mockExamSchedulers: ExamScheduler[] = [];
for (let i = 1; i <= 3; ++i) {
    const year = "2024";
    const classIndex = i.toString().padStart(2, "0");  // "01", "02", "03", etc.
    const baseClassId = `Toan_101`;
    const classId = generateClassId(baseClassId, year, classIndex);
    const baseExamName = `Thi Cuối Kỳ`;

    mockExamSchedulers.push({
        id: generateExamID(classId, 1),
        classId,
        examName: baseExamName,
        attemptNumber: 1,  // First attempt
        startTime: `09:00 09/09/${year}`,
        endTime: `11:00 09/09/${year}`,
        location: `Phòng ${i}`,
        invigilators: [`Giám Thị${i}`, `Giám Thị${i + 1}`],
    });

    mockExamSchedulers.push({
        id: generateExamID(classId, 2),
        classId,
        examName: baseExamName,
        attemptNumber: 2,  // Second attempt
        startTime: `09:00 16/09/${year}`,
        endTime: `11:00 16/09/${year}`,
        location: `Phòng ${i}`,
        invigilators: [`Giám Thị${i}`, `Giám Thị${i + 1}`],
    });
}

// Define the props for editable cell component
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'text' | 'date' | 'number';
    record: ExamScheduler;
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
    let inputNode;
    if (inputType === 'number') {
        inputNode = <InputNumber />;
    } else if (inputType === 'date') {
        inputNode = <DatePicker showTime format="HH:mm DD/MM/YYYY" />;
    } else {
        inputNode = <Input />;
    }

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: `Vui lòng nhập ${title}!` }]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export default function ExamSchedulerPage() {
    const { user, loading } = useAuth();

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
                <Title level={2} style={{ marginBottom: '24px', color: '#1677ff' }}>Vui lòng đăng nhập để truy cập nội dung</Title>
                <Link href="/dashboard" passHref>
                    <Button type="primary" size="large">Đăng nhập</Button>
                </Link>
            </div>
        );
    }
    const [form] = Form.useForm();
    const [data, setData] = useState(mockExamSchedulers);
    const [editingID, setEditingID] = useState<string | null>(null);

    const isEditing = (record: ExamScheduler) => record.id === editingID;

    const edit = (record: Partial<ExamScheduler> & { id: React.Key }) => {
        form.setFieldsValue({ ...record });
        setEditingID(record.id as string);
    };

    const cancel = () => {
        setEditingID(null);
    };

    const save = async (id: React.Key) => {
        try {
            const row = (await form.validateFields()) as ExamScheduler;
            const newData = [...data];
            const index = newData.findIndex((item) => item.id === id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                setEditingID(null);
            }
        } catch (error) {
            console.log('Có lỗi xảy ra khi chỉnh sửa các hàng, xem examScheduler.tsx', error);
        }
    };

    const columns = [
        {
            title: 'Tên kỳ thi',
            dataIndex: 'examName',
            width: '10%',
            editable: true,
        },
        {
            title: 'Mã lớp học',
            dataIndex: 'classId',
            width: '15%',
            editable: true,
            render: (text: string) => text,
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'startTime',
            width: '15%',
            editable: true,
            render: (text: string) => text,
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'endTime',
            width: '15%',
            editable: true,
            render: (text: string) => text,
        },
        {
            title: 'Địa điểm',
            dataIndex: 'location',
            width: '15%',
            editable: true,
        },
        {
            title: 'Giám thị',
            dataIndex: 'invigilators',
            width: '20%',
            editable: true,
            render: (invigilators: string[]) => invigilators.join(', '),
        },
        {
            title: 'Thao tác',
            dataIndex: 'operation',
            render: (_: any, record: ExamScheduler) => {
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

    const mergedColumns: TableProps<ExamScheduler>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: ExamScheduler) => ({
                record,
                inputType: col.dataIndex.includes('Time') ? 'date' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
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
