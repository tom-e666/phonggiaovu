import React from "react";
import {DatePicker, Form, Input, InputNumber} from "antd";

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
export const InitialClassView=()=>{
    return (
        <>

        </>
    )
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'text' | 'date' | 'number';
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


