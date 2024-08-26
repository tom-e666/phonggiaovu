'use client';

import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Popconfirm, Spin, Table, TableProps, Typography } from "antd";
import CoursesTable from "@/app/examscheduler/initialView";
import ExamScheduleTable from "@/app/examscheduler/scheduler";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import {useAuth} from "@/firebase/initFirebase";

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
    const { user, loading } = useAuth();
    const [gridContent, setGridContent] = useState(0);
    const getCurrentViewLabel = () => {
        switch (gridContent) {
            case 0:
                return "Danh sách môn học";
            case 1:
                return "Lịch thi lần 1";
            case 2:
                return "Lịch thi lần 2";
            default:
                return "Lỗi";
        }
    };
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
    }    return (
        <>
            <div style={{ marginBottom: "16px" }}>
                <Button type="primary" onClick={() => setGridContent(0)} style={{ marginRight: "8px" }}>
                    Danh sách môn học
                </Button>
                <Button type="primary" onClick={() => setGridContent(1)} style={{ marginRight: "8px" }}>
                    Lịch thi lần 1
                </Button>
                <Button type="primary" onClick={() => setGridContent(2)}>
                    Lịch thi lần 2
                </Button>
            </div>
            <div style={{ margin: "16px 0", fontWeight: "bold" }}>
                {getCurrentViewLabel()}
            </div>
            {gridContent === 0 && (<CoursesTable />)}
            {gridContent === 1 && (<div><ExamScheduleTable take={'take1'} /></div>)}
            {gridContent === 2 && (<div><ExamScheduleTable take={'take2'} /></div>)}
        </>
    );
}

export default Page;
