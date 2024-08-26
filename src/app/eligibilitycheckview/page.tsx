'use client';

import React, {useEffect, useState} from 'react';
import {Button, Card, List, Select, Spin, Table, Tag, Typography} from "antd";
import {db, useAuth} from "@/firebase/initFirebase";
import Link from "next/link";
import Title from "antd/es/typography/Title";
import {collection, doc, getDoc, getDocs, query, where} from '@firebase/firestore';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';


const { Option } = Select;

interface Course {
    code: string;
    credits: number;
    isCompulsory: boolean;
    name: string;
}

interface Student {
    id: string;
    name: string;
}

interface StudentScore {
    classCode: string;
    className: string;
    take1: number | null;
    take2: number | null;
}

async function fetchStudentScores(studentId: string | null, classCode: string): Promise<StudentScore | null> {
    try {
        if (!studentId || !classCode) {
            return null;
        }
        const classCollection = collection(db, 'classes');
        const q = query(classCollection, where('code', '==', classCode));
        const classSnapshot = await getDocs(q);

        if (!classSnapshot.empty) {
            const classDoc = classSnapshot.docs[0];
            const classData = classDoc.data();
            const student = classData.students.find((student: any) => student.id === studentId);

            if (student) {
                return {
                    classCode: classData.code,
                    className: classData.name,
                    take1: student.take1 || null,
                    take2: student.take2 || null,
                };
            }
        }
    } catch (error) {
        console.error("Failed to fetch student scores:", error);
    }
    return null;
}
const SummaryComponent = ({
                              studentScores,
                              coursesData,
                              selectedStudent,
                          }: {
    studentScores: Record<string, StudentScore | null>,
    coursesData: Course[],
    selectedStudent: string|null,
}) => {
    if(!selectedStudent) return;
    const totalCredits = 122;
    let completedCredits = 0;
    const missingCourses: Course[] = [];

    coursesData.forEach(course => {
        const studentScore = studentScores[course.code];
        if (studentScore) {
            const highestScore = Math.max(studentScore.take1 ?? 0, studentScore.take2 ?? 0);
            if (highestScore >= 5) {
                completedCredits += course.credits;
            } else if (course.isCompulsory || highestScore < 5) {
                missingCourses.push(course);
            }
        } else if (course.isCompulsory) {
            missingCourses.push(course);
        }
    });

    const isEligibleForTranscript = completedCredits >= totalCredits && missingCourses.length === 0;

    const generateTranscript = async () => {
        const obtainStudent = async () => {
            const studentDoc = await getDoc(doc(db, 'students', selectedStudent));
            if (studentDoc.exists()) {
                return studentDoc.data();
            } else {
                throw new Error('Student not found');
            }
        };

        const student = await obtainStudent();

        const docPDF = new jsPDF();

        docPDF.setFontSize(18);
        docPDF.text('Học Bạ Sinh Viên', 14, 22);

        docPDF.setFontSize(12);
        docPDF.text(`Họ Tên: ${student.name}`, 14, 30);
        docPDF.text(`Mã Sinh Viên: ${student.id}`, 14, 36);
        docPDF.text(`Tổng Tín Chỉ: ${completedCredits} / ${totalCredits}`, 14, 42);

        const courseData = coursesData.map(course => [
            course.code,
            course.name,
            course.credits,
            studentScores[course.code]?.take1 ?? 'N/A',
            studentScores[course.code]?.take2 ?? 'N/A',
            Math.max(studentScores[course.code]?.take1 ?? 0, studentScores[course.code]?.take2 ?? 0) >= 5 ? 'Đạt' : 'Không Đạt'
        ]);

        docPDF.autoTable({
            head: [['Mã', 'Tên', 'Tín Chỉ', 'Điểm Lần 1', 'Điểm Lần 2', 'Trạng Thái']],
            body: courseData,
            startY: 50,
        });

        docPDF.text('Học bạ được tạo bởi hệ thống', 14, docPDF.internal.pageSize.height - 10);

        docPDF.save(`${student.name}_Hoc_Ba.pdf`);
    };

    return (
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <Card title="Tín chỉ đã hoàn thành" style={{ flex: 1, height: "fit-content" }}>
                <Typography.Title
                    level={2}
                    style={{ color: completedCredits >= totalCredits ? 'green' : 'red' }}
                >
                    {completedCredits} / {totalCredits}
                </Typography.Title>
                {isEligibleForTranscript && (
                    <Button onClick={generateTranscript} type="primary">
                        Xuất Học Bạ
                    </Button>
                )}
            </Card>
            <Card title="Lớp học phần còn thiếu" style={{ flex: 2 }}>
                <List
                    dataSource={missingCourses}
                    renderItem={item => (
                        <List.Item>
                            <Typography.Text>{item.name} ({item.code})</Typography.Text>
                            <Tag color="volcano">{item.isCompulsory ? 'Bắt buộc' : 'Tự chọn'}</Tag>
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};
function Page() {
    const { user, loading } = useAuth();
    const [coursesData, setCoursesData] = useState<Course[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const [studentScores, setStudentScores] = useState<Record<string, StudentScore | null>>({});

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const courseSnapshot = await getDocs(collection(db, 'courses'));
                const courses: Course[] = courseSnapshot.docs.map(doc => ({
                    code: doc.data().code,
                    credits: doc.data().credits,
                    isCompulsory: doc.data().isCompulsory,
                    name: doc.data().name,
                }));
                setCoursesData(courses);
            } catch (e) {
                console.error('Failed to load courses:', e);
            }
        };

        const loadStudents = async () => {
            try {
                const studentSnapshot = await getDocs(collection(db, 'students'));
                const students: Student[] = studentSnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                }));
                setStudents(students);
            } catch (e) {
                console.error('Failed to load students:', e);
            }
        };
        loadCourses();
        loadStudents();
    }, []);

    useEffect(() => {
        const fetchAllScores = async () => {
            if (!selectedStudent) return;
            const newScores: Record<string, StudentScore | null> = {};
            for (const record of coursesData) {
                newScores[record.code] = await fetchStudentScores(selectedStudent, record.code);
            }
            setStudentScores(newScores);
        };

        fetchAllScores();
    }, [selectedStudent, coursesData]);

    const handleStudentChange = async (value: string) => {
        setSelectedStudent(value);
    };

    if (loading) {
        return <Spin size="large" />
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
                    <a><Button type="primary" size="large">Đăng nhập</Button></a>
                </Link>
            </div>
        )
    }

    const columns = [
        {
            title: 'Mã',
            dataIndex: 'code',
            width: '10%',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            width: '10%',
        },
        {
            title: 'Số tín chỉ',
            dataIndex: 'credits',
            width: '10%',
        },
        {
            title: 'Bắt buộc',
            dataIndex: 'isCompulsory',
            width: '10%',
            render: (isCompulsory: boolean) => (
                <Tag color={isCompulsory ? 'green' : 'red'}>
                    {isCompulsory ? 'Có' : 'Không'}
                </Tag>
            ),
        },
        {
            title: 'Điểm thi',
            width: '10%',
            render: (_: any, record: Course) => {
                const studentScore = studentScores[record.code];  // Sử dụng mã lớp để lấy điểm thi từ studentScores
                if (studentScore) {
                    const highestScore = Math.max(studentScore.take1 ?? 0, studentScore.take2 ?? 0);
                    const color = highestScore >= 5 ? 'green' : 'red';
                    return (
                        <Tag color={color}>
                            {highestScore !== 0 ? highestScore : 'Chưa có điểm'}
                        </Tag>
                    );
                } else {
                    return <Tag color="gray">Không tìm thấy</Tag>;
                }
            },
        }
    ];

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div style={{ marginBottom: '20px' }}>
                <Typography.Text strong>Chọn sinh viên: </Typography.Text>
                <Select
                    style={{ width: 300 }}
                    placeholder="Chọn sinh viên"
                    onChange={handleStudentChange}
                    value={selectedStudent}
                >
                    {students.map(student => (
                        <Option key={student.id} value={student.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{student.name}</span>
                                <span style={{ color: '#888' }}>{student.id}</span>
                            </div>
                        </Option>
                    ))}
                </Select>
            </div>
            <Table
                bordered
                dataSource={coursesData}
                columns={columns}
                rowKey="code"
                pagination={{ pageSize: 10 }}
                scroll={{ y: 'calc(100vh - 300px)' }}
            />
            <SummaryComponent studentScores={studentScores} coursesData={coursesData} selectedStudent={selectedStudent} />
            <div>content?</div>
        </div>
    )
}
export default Page;
