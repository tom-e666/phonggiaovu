'use client';

import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Popconfirm, Spin, Table, TableProps, Typography } from "antd";
import { useAuth } from "@/firebase/initFirebase";
import Link from "next/link";
import Title from "antd/es/typography/Title";
import CoursesTable from "@/app/examscheduler/initialView";
import ExamScheduleTable from "@/app/examscheduler/scheduler";

interface ExamRoom {
    roomId: string;
    location: string;
    capacity: number;
    invigilators: string[];
}
interface ExamSchedule {
    examId: string;
    courseName: string;
    courseId?:string;
    studentCount: number;
    term: string;
    examDate: string; // "dd/mm/yyyy"
    examShift: number;
    rooms: ExamRoom[];
    note?: string;
    examStatus?: string;
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: ExamSchedule;
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
    )
};

function Page() {
    const [gridContent, setGridContent] = useState(0);
    return (
    <>
    <Button type="primary" onClick={()=>{setGridContent((gridContent+1)%3)}}>Chuyển view</Button>
        {gridContent === 0 && (<CoursesTable></CoursesTable>)}
        {gridContent === 1 && (<div><ExamScheduleTable/></div>)}
        {gridContent === 2 && (<div><ExamScheduleTable/></div>)}
    </>
    )
}

export default Page;
