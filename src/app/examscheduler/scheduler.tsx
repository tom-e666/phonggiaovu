'use client';
import React, {useEffect, useState} from "react";
import {
    Button,
    Checkbox,
    DatePicker,
    Form,
    Input,
    InputNumber,
    message,
    Popconfirm,
    Spin,
    Table,
    TableProps,
    Typography
} from "antd";
import {collection, doc, getDocs, setDoc, writeBatch} from "@firebase/firestore";
import {db} from "@/firebase/initFirebase";
import {Moment} from 'moment';

interface CourseView {
    id: string;        // Course ID
    name: string;      // Course name
    studentCount: number; // Total number of students in the course
}

interface ExamSchedule {
    id: string;
    courseId: string;
    courseName: string;
    location: string;
    invigilator1: string;
    invigilator2: string;
    invigilatorsId: string[];
    date: string;
    session: number|null;
    startTime?: string;
    endTime?: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'text' | 'number';
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
const ExamScheduleTable = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState<ExamSchedule[]>([]);
    const [editingID, setEditingID] = useState<string | null>(null);
    const [lockedRows, setLockedRows] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<CourseView[]>([]);
    const[hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<Moment>();
    function handleSuggestSchedule() {
        if (!startDate) {
            message.error("Vui lòng chọn ngày bắt đầu trước khi đề xuất lịch!");
            return;
        }

        const rooms = ["Room1", "Room2", "Room3"]; // Danh sách các phòng thi
        const roomCapacity = 30;
        const sessionsPerDay = 4;

        const newSchedules: ExamSchedule[] = [];

        let currentDate = startDate.clone();
        let currentSession = 1; // Bắt đầu từ ca 1

        courses.forEach(course => {
            let remainingStudents = course.studentCount;
            let roomIndex = 0; // Bắt đầu từ phòng đầu tiên

            while (remainingStudents > 0) {
                const currentRoom = rooms[roomIndex];
                const studentsInCurrentRoom = Math.min(remainingStudents, roomCapacity);

                const newSchedule: ExamSchedule = {
                    id: `${course.id}-${newSchedules.length}`,
                    courseId: course.id,
                    courseName: course.name,
                    location: currentRoom,
                    invigilator1: '',
                    invigilator2: '',
                    invigilatorsId: ['', ''],
                    date: currentDate.format("DD/MM/YYYY"),
                    session: currentSession,
                    startTime: ``,
                    endTime: ``,
                };

                newSchedules.push(newSchedule);
                remainingStudents -= studentsInCurrentRoom;
                roomIndex++;

                if (roomIndex >= rooms.length || remainingStudents <= 0) {
                    // Reset room index nếu đã dùng hết phòng hoặc đủ sinh viên
                    roomIndex = 0;
                    // Chuyển sang ca tiếp theo cho môn khác
                    currentSession++;
                    if (currentSession > sessionsPerDay) {
                        currentSession = 1;
                        while (currentDate.day() === 0) {
                            currentDate = currentDate.add(1, 'day'); // Chuyển sang ngày Thứ Hai)
                        }                    }
                }
            }
        });

        setData(newSchedules);
        setHasUnsavedChanges(true);
        message.success("Lịch thi đã được đề xuất thành công!");
    }


    async function handleSuggestInvigilator() {
        try {
            const lecturersSnapshot = await getDocs(collection(db, "lecturers"));
            const lecturers = lecturersSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: data.id,
                    name: data.name,
                };
            });

            const usedLecturersBySession: { [key: string]: Set<string> } = {};

            const updatedSchedules = data.map((schedule) => {
                const sessionKey = `${schedule.date}-${schedule.session}`;

                if (!usedLecturersBySession[sessionKey]) {
                    usedLecturersBySession[sessionKey] = new Set();
                }

                let invigilator1 = null;
                let invigilator2 = null;

                for (let i = 0; i < lecturers.length; i++) {
                    if (!usedLecturersBySession[sessionKey].has(lecturers[i].id)) {
                        invigilator1 = lecturers[i];
                        usedLecturersBySession[sessionKey].add(invigilator1.id);
                        break;
                    }
                }

                // Find invigilator2
                for (let i = 0; i < lecturers.length; i++) {
                    if (
                        !usedLecturersBySession[sessionKey].has(lecturers[i].id) &&
                        lecturers[i].id !== invigilator1?.id
                    ) {
                        invigilator2 = lecturers[i];
                        usedLecturersBySession[sessionKey].add(invigilator2.id);
                        break;
                    }
                }

                return {
                    ...schedule,
                    invigilator1: invigilator1 ? invigilator1.name : '',
                    invigilator2: invigilator2 ? invigilator2.name : '',
                    invigilatorsId: [invigilator1?.id || '', invigilator2?.id || ''],
                };
            });
            setData(updatedSchedules);
            setHasUnsavedChanges(true);
            message.success("Giám thị đã được phân bổ thành công!");

        } catch (error) {
            console.error("Failed to fetch lecturers:", error);
            message.error("Không thể lấy danh sách giám thị.");
        }
    }

        async function createSchedule() {
            try {
                for (const schedule of data) {
                    const scheduleDocRef = doc(collection(db, 'examSchedules'), schedule.id);
                    await setDoc(scheduleDocRef, schedule);
                }
                setHasUnsavedChanges(false); // Changes have been saved
                alert("Lịch thi đã được lưu thành công!");
            } catch (error) {
                console.error("Failed to save schedule:", error);
            }
    }
    async function deleteSchedule() {

        try {
            const schedulesSnapshot = await getDocs(collection(db, "examSchedules"));

            if (schedulesSnapshot.empty) {
                message.error("Không có bản ghi nào để xóa");
                return;
            }
            const batch = writeBatch(db); // Use writeBatch to create a batch

            schedulesSnapshot.docs.forEach(scheduleDoc => {
                const scheduleRef = doc(db, "examSchedules", scheduleDoc.id);
                batch.delete(scheduleRef); // Add delete operation to the batch
            });

            await batch.commit();
            setData([]);
            message.success("Xóa thành công");
        } catch (error) {
            console.error("Failed to delete all schedules:", error);
        }
    }
    function reloadSchedule() {
        const initialExamSchedules = courses.map(course => ({
            id: course.id,
            courseId: course.id,
            courseName: course.name,
            location: '',
            invigilator1: '',
            invigilator2: '',
            invigilatorsId: ['', ''],
            date: '',
            session:null,
        }));
        setData(initialExamSchedules);
        setEditingID(null);
        setLockedRows([]);
    }
    const isEditing = (record: ExamSchedule) => record.id === editingID;

    const edit = (record: Partial<ExamSchedule> & { id: React.Key }) => {
        form.setFieldsValue({ ...record });
        setEditingID(record.id as string);
    };

    const cancel = () => {
        setEditingID(null);
    };

    const save = async (id: React.Key) => {
        try {
            const row = (await form.validateFields()) as ExamSchedule;
            const newData = [...data];
            const index = newData.findIndex((item) => id === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                setEditingID(null);
            }
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    const handleLock = (id: string, checked: boolean) => {
        if (checked) {
            setLockedRows([...lockedRows, id]);
        } else {
            setLockedRows(lockedRows.filter((lockedId) => lockedId !== id));
        }
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const classesSnapshot = await getDocs(collection(db, "classes"));

                const courseMap = new Map<string, CourseView>();

                classesSnapshot.docs.forEach(doc => {
                    const data = doc.data();
                    const key = data.code;

                    if (courseMap.has(key)) {
                        const existingCourse = courseMap.get(key)!;
                        existingCourse.studentCount += data.capacity || 30;
                    } else {
                        courseMap.set(key, {
                            id: data.code,
                            name: data.name || '',
                            studentCount: data.capacity || 0,
                        });
                    }
                });

                const fetchedCourses = Array.from(courseMap.values());
                setCourses(fetchedCourses);

                const initialExamSchedules = fetchedCourses.map(course => ({
                    id: course.id,
                    courseId: course.id,
                    courseName: course.name,
                    location: '',
                    invigilator1: '',
                    invigilator2: '',
                    invigilatorsId: ['', ''],
                    date: '',
                    session: null,
                }));
                setData(initialExamSchedules);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch courses", error);
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const columns = [
        {
            title: 'Mã Môn Học',
            dataIndex: 'courseId',
            width: '10%',
            editable: true,
        },
        {
            title: 'Tên Môn Học',
            dataIndex: 'courseName',
            width: '15%',
            editable: true,
        },
        {
            title: 'Địa Điểm',
            dataIndex: 'location',
            width: '10%',
            editable: true,
        },
        {
            title: 'Giám Thị 1',
            dataIndex: 'invigilator1',
            width: '15%',
            editable: true,
        },
        {
            title: 'Giám Thị 2',
            dataIndex: 'invigilator2',
            width: '15%',
            editable: true,
        },
        {
            title: 'Ngày Thi',
            dataIndex: 'date',
            width: '10%',
            editable: true,
        },
        {
            title: 'Ca Thi',
            dataIndex: 'session',
            width: '10%',
            editable: true,
        },
        {
            title: 'Khóa',
            dataIndex: 'lock',
            width: '7%',

            render: (_: any, record: ExamSchedule) => (

                <Checkbox
                    checked={lockedRows.includes(record.id)}
                    onChange={(e) => handleLock(record.id, e.target.checked)}
                />
            ),
        },
        {
            title: 'Thao Tác',
            dataIndex: 'operation',
            render: (_: any, record: ExamSchedule) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
                            Lưu
                        </Typography.Link>
                        <Popconfirm title="Bạn có chắc muốn hủy?" onConfirm={cancel}>
                            <a>Hủy</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link
                        disabled={editingID !== null || lockedRows.includes(record.id)}
                        onClick={() => edit(record)}>
                        Sửa
                    </Typography.Link>
                );
            },
        },
    ];

    const mergedColumns: TableProps<ExamSchedule>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: ExamSchedule) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <>
            <div>Chọn ngày bắt đầu:
                <DatePicker
                    onChange={(date:Moment,dateString)=>{
                        setStartDate(date);
                    }}
                    format="DD/MM/YYYY"
                />
            </div>

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
                    pagination={{onChange: cancel}}
                    scroll={{y: 'calc(100vh - 300px)'}}
                    rowKey="id"
                />
            </Form>
            <div style={{marginTop: '16px'}}>
                <div style={{display: 'flex'}}>
                    <div>
                        <Button type="primary" style={{marginRight: '8px'}} onClick={handleSuggestSchedule}>
                            Đề xuất Lịch
                        </Button>
                        <Button type="primary" style={{marginRight: '8px'}} onClick={handleSuggestInvigilator}>
                            Đề xuất giám thị
                        </Button>
                    </div>
                    <div>
                        <Button type="primary" style={{marginRight: '8px'}} onClick={createSchedule}
                                disabled={!hasUnsavedChanges}>
                            Cập nhật
                        </Button>
                        <Button type="primary" style={{marginRight: '8px'}} onClick={deleteSchedule}>
                            Xóa
                        </Button>
                        <Button type="default" onClick={reloadSchedule}>
                            Tải lại
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExamScheduleTable;
