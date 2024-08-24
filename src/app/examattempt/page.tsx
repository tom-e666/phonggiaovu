'use client'
import React, { useState } from "react";
import {
    Form,
    Input,
    InputNumber,
    Switch,
    Popconfirm,
    Table,
    TableProps,
    Typography,
    Spin,
    Button
} from "antd";
import { useAuth } from "@/firebase/initFirebase";
import Link from "next/link";
import Title from "antd/es/typography/Title";

// Define the ExamAttempt interface
interface ExamAttempt {
    attemptId: string;
    examScheduleId: string;
    studentId: string;
    score: number;
    isRetake: boolean;
    attemptDate: string;
    startTime: string;
    endTime: string;
}

// Mock data for exam attempts
const mockExamAttempts: ExamAttempt[] = [];
for (let i = 1; i <= 10; ++i) {
    mockExamAttempts.push({
        attemptId: `Attempt_${i}_1`,
        examScheduleId: `Math_101_2024_Class01_Attempt1`,
        studentId: `Student_${i}`,
        score: Math.floor(Math.random() * 100),
        isRetake: false,
        attemptDate: `09:00 09/09/2024`,
        startTime: `08:00 09/09/2024`,
        endTime: `10:00 09/09/2024`,
    });

    mockExamAttempts.push({
        attemptId: `Attempt_${i}_2`,
        examScheduleId: `Math_101_2024_Class01_Attempt2`,
        studentId: `Student_${i}`,
        score: Math.floor(Math.random() * 100),
        isRetake: true,
        attemptDate: `09:00 16/09/2024`,
        startTime: `08:00 16/09/2024`,
        endTime: `10:00 16/09/2024`,
    });
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'text' | 'number' | 'boolean';
    record: ExamAttempt;
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
    } else if (inputType === 'boolean') {
        inputNode = <Switch defaultChecked={record[dataIndex as keyof ExamAttempt] as boolean} />;
    } else {
        inputNode = <Input />;
    }

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: `Vui lòng nhập ${title}.` }]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export default function ExamAttemptPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                height: '100vh',
            }}>
                <Title level={2} style={{ marginBottom: '24px', color: '#1677ff' }}>
                    Truy cập bị hạn chế
                </Title>
                <p>Vui lòng đăng nhập để xem thông tin kỳ thi của bạn.</p>
                <Link href="/login" passHref>
                    <Button type="primary" size="large">Đăng nhập</Button>
                </Link>
            </div>
        );
    }

    const [form] = Form.useForm();
    const [data, setData] = useState(mockExamAttempts);
    const [editingID, setEditingID] = useState<string | null>(null);

    const isEditing = (record: ExamAttempt) => record.attemptId === editingID;

    const edit = (record: Partial<ExamAttempt> & { attemptId: React.Key }) => {
        form.setFieldsValue({ ...record });
        setEditingID(record.attemptId as string);
    };

    const cancel = () => {
        setEditingID(null);
    };

    const save = async (id: React.Key) => {
        try {
            const row = (await form.validateFields()) as ExamAttempt;
            const newData = [...data];
            const index = newData.findIndex((item) => item.attemptId === id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                setEditingID(null);
            }
        } catch (error) {
            console.log('Có lỗi xảy ra khi chỉnh sửa các hàng, xem examAttempt.tsx', error);
        }
    };

    const columns = [
        {
            title: 'Mã lần thi',
            dataIndex: 'attemptId',
            width: '10%',
            editable: true,
        },
        {
            title: 'Mã kỳ thi',
            dataIndex: 'examScheduleId',
            width: '15%',
            editable: true,
        },
        {
            title: 'Mã sinh viên',
            dataIndex: 'studentId',
            width: '10%',
            editable: true,
        },
        {
            title: 'Điểm số',
            dataIndex: 'score',
            width: '7%',
            editable: true,
        },
        {
            title: 'Thi lần 2',
            dataIndex: 'isRetake',
            width: '10%',
            editable: true,
            render: (isRetake: boolean) => (isRetake ? 'Có' : 'Không'),
        },
        {
            title: 'Ngày thi',
            dataIndex: 'attemptDate',
            width: '10%',
            editable: true,
            render: (text: string) => text,
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'startTime',
            width: '15%',
            editable: true,
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'endTime',
            width: '15%',
            editable: true,
        },
        {
            title: 'Hành động',
            dataIndex: 'operation',
            render: (_: any, record: ExamAttempt) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.attemptId)} style={{ marginRight: 8 }}>
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

    const mergedColumns: TableProps<ExamAttempt>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: ExamAttempt) => ({
                record,
                inputType:
                    col.dataIndex === 'score'
                        ? 'number'
                        : col.dataIndex === 'isRetake'
                            ? 'boolean'
                            : 'text',
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
