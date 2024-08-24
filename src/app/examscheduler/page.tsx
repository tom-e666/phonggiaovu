'use client'
import React, { useState } from "react";
import { Form, Input, DatePicker, InputNumber, Popconfirm, Table, TableProps, Typography } from "antd";

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
    const baseClassId = `Math_101`;
    const classId = generateClassId(baseClassId, year, classIndex);
    const baseExamName = `Final Exam`;

    mockExamSchedulers.push({
        id: generateExamID(classId, 1),
        classId,
        examName: baseExamName,
        attemptNumber: 1,  // First attempt
        startTime: `09:00 09/09/${year}`,
        endTime: `11:00 09/09/${year}`,
        location: `Room ${i}`,
        invigilators: [`Lecturer${i}`, `Lecturer${i + 1}`],
    });

    mockExamSchedulers.push({
        id: generateExamID(classId, 2),
        classId,
        examName: baseExamName,
        attemptNumber: 2,  // Second attempt
        startTime: `09:00 16/09/${year}`,
        endTime: `11:00 16/09/${year}`,
        location: `Room ${i}`,
        invigilators: [`Lecturer${i}`, `Lecturer${i + 1}`],
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

export default function ExamSchedulerPage() {
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
            console.log('There is a problem with editing rows, see examScheduler.tsx', error);
        }
    };

    const columns= [
        {
            title: 'Exam Name',
            dataIndex: 'examName',
            width: '10%',
            editable: true,
        },
        {
            title: 'Class ID',
            dataIndex: 'classId',
            width: '15%',
            editable: true,
            render: (text: string) => text,
        },
        {
            title: 'Start Time',
            dataIndex: 'startTime',
            width: '15%',
            editable: true,
            render: (text: string) => text,
        },
        {
            title: 'End Time',
            dataIndex: 'endTime',
            width: '15%',
            editable: true,
            render: (text: string) => text,
        },
        {
            title: 'Location',
            dataIndex: 'location',
            width: '15%',
            editable: true,
        },
        {
            title: 'Invigilators',
            dataIndex: 'invigilators',
            width: '20%',
            editable: true,
            render: (invigilators: string[]) => invigilators.join(', '),
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_: any, record: ExamScheduler) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
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
