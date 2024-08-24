'use client'
import React, { useState } from "react";
import { Form, Input, InputNumber, DatePicker, Switch, Popconfirm, Table, TableProps, Typography } from "antd";

// Define the ExamAttempt interface
interface ExamAttempt {
    attemptId: string;  // Unique identifier for the exam attempt
    examScheduleId: string;  // ID of the related exam schedule
    studentId: string;  // ID of the student
    score: number;  // Score achieved in this attempt
    isRetake: boolean;  // Whether this attempt is a retake
    attemptDate: string;  // Date of this attempt in "HH:mm DD/MM/YYYY" format
}

// Mock data for exam attempts
const mockExamAttempts: ExamAttempt[] = [];
for (let i = 1; i <= 10; ++i) {
    mockExamAttempts.push({
        attemptId: `Attempt_${i}_1`,
        examScheduleId: `Math_101_2024_Class01_Attempt1`,
        studentId: `Student_${i}`,
        score: Math.floor(Math.random() * 100),  // Random score between 0-100
        isRetake: false,
        attemptDate: `09:00 09/09/2024`,  // Example date format
    });

    mockExamAttempts.push({
        attemptId: `Attempt_${i}_2`,
        examScheduleId: `Math_101_2024_Class01_Attempt2`,
        studentId: `Student_${i}`,
        score: Math.floor(Math.random() * 100),  // Random score between 0-100
        isRetake: true,
        attemptDate: `09:00 16/09/2024`,  // Example date format
    });
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'text' | 'number' | 'boolean' | 'date';
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
                    rules={[{ required: true, message: `Please Input ${title}!` }]}
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
            console.log('There is a problem with editing rows, see examAttempt.tsx', error);
        }
    };

    const columns= [
        {
            title: 'Attempt ID',
            dataIndex: 'attemptId',
            width: '10%',
            editable: true,
        },
        {
            title: 'Exam Schedule ID',
            dataIndex: 'examScheduleId',
            width: '25%',
            editable: true,
        },
        {
            title: 'Student ID',
            dataIndex: 'studentId',
            width: '15%',
            editable: true,
        },
        {
            title: 'Score',
            dataIndex: 'score',
            width: '10%',
            editable: true,
        },
        {
            title: 'Retake',
            dataIndex: 'isRetake',
            width: '10%',
            editable: true,
            render: (isRetake: boolean) => (isRetake ? 'Yes' : 'No'),
        },
        {
            title: 'Attempt Date',
            dataIndex: 'attemptDate',
            width: '20%',
            editable: true,
            render: (text: string) => text,
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_: any, record: ExamAttempt) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.attemptId)} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Are you sure you want to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingID !== null} onClick={() => edit(record)}>
                        Edit
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
                            : col.dataIndex === 'attemptDate'
                                ? 'date'
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
