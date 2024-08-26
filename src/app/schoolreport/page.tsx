'use client';

import React, { useEffect, useState } from 'react';
import { Button, Card, List, Select, Spin, Table, Tag, Typography, message } from "antd";
import { db, useAuth } from "@/firebase/initFirebase";
import Link from "next/link";
import Title from "antd/es/typography/Title";
import { collection, doc, getDoc, getDocs, query, where } from '@firebase/firestore';
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
    selectedStudent: string | null,
}) => {
    if (!selectedStudent) return null;

    const totalCredits = 122;
    let completedCredits = 0;
    const missingCourses: Course[] = [];
    const finishedCourses: (Course & StudentScore)[] = [];

    coursesData.forEach(course => {
        const studentScore = studentScores[course.code];
        if (studentScore) {
            const highestScore = Math.max(studentScore.take1 ?? 0, studentScore.take2 ?? 0);
            if (highestScore >= 5) {
                completedCredits += course.credits;
                finishedCourses.push({
                    ...course,        // Include course information
                    ...studentScore,  // Include student score information
                });
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
        docPDF.setFont("Times");
        docPDF.setFont("Roboto");
        docPDF.setFontSize(13);
        docPDF.text("PHỤ LỤC VĂN BẰNG CỬ NHÂN", 80, 10);
        docPDF.text("1. Thông tin về người được cấp văn bằng", 14, 20);
        docPDF.text(`Họ và tên: ${student.name}`, 14, 30);
        docPDF.text(`Ngày tháng năm sinh: ${student.birth}`, 14, 40);

        docPDF.text("2. Thông tin về văn bằng", 14, 50);
        docPDF.text(`Cơ sở giáo dục đại học cấp bằng: ${student.faculty}`, 14, 60);
        docPDF.text(`Chuyên ngành đào tạo: ${student.faculty}`, 14, 70);
        docPDF.text(`Ngày nhập học: 5/9/2022`, 14, 80);
        docPDF.text(`Ngôn ngữ đào tạo: Tiếng Việt`, 14, 90);
        docPDF.text(`Thời gian đào tạo: 4 năm`, 14, 100);
        docPDF.text(`Trình độ đào tạo: Cử nhân`, 14, 110);
        docPDF.text(`Hình thức đào tạo: Trực tiếp`, 14, 120);


        const convertTo4 = (grade10: number): number => {
            if (grade10 >= 8.5) return 4.0;
            if (grade10 >= 7.0) return 3.0;
            if (grade10 >= 5.5) return 2.0;
            if (grade10 >= 4.0) return 1.0;
            return 0.0;
        };

        const tableColumnHeaders = [
            ["TT", "Mã học phần", "Tên học phần", "Số tín chỉ", "Điểm thang 10", "Điểm thang 4", "Điểm chữ"]
        ];

        const tableRows = finishedCourses.map((course, index) => {
            const highestScore = Math.max(course.take1 ?? 0, course.take2 ?? 0);
            const grade4 = convertTo4(highestScore);
            const letterGrade = grade4 === 4.0 ? 'A' : grade4 === 3.0 ? 'B' : grade4 === 2.0 ? 'C' : grade4 === 1.0 ? 'D' : 'F';

            return [
                index + 1,
                course.code,
                course.name,
                course.credits,
                highestScore !== 0 ? highestScore : 'N/A',
                grade4 !== 0.0 ? grade4.toFixed(2) : 'N/A',
                letterGrade,
            ];
        });
        docPDF.autoTable({
            head: tableColumnHeaders,
            body: tableRows,
            startY: 130
        });
        const totalCreditPoints10 = finishedCourses.reduce((acc, course) => acc + (Math.max(course.take1 ?? 0, course.take2 ?? 0) * course.credits), 0);
        const totalCreditPoints4 = finishedCourses.reduce((acc, course) => acc + (convertTo4(Math.max(course.take1 ?? 0, course.take2 ?? 0)) * course.credits), 0);
        const totalCreditsAccumulated = finishedCourses.reduce((acc, course) => acc + course.credits, 0);
        const averageGrade10 = totalCreditPoints10 / totalCreditsAccumulated;
        const averageGrade4 = totalCreditPoints4 / totalCreditsAccumulated;
        const finalClassification = averageGrade4 >= 3.6 ? "Xuất sắc" :
            averageGrade4 >= 3.2 ? "Giỏi" :
                averageGrade4 >= 2.5 ? "Khá" :
                    averageGrade4 >= 2.0 ? "Trung bình" : "Yếu";

        docPDF.text(`Tổng số tín chỉ tích lũy: ${totalCreditsAccumulated}`, 14, docPDF.autoTable.previous.finalY + 10);
        docPDF.text(`Điểm trung bình tích lũy thang 10: ${averageGrade10.toFixed(2)}`, 14, docPDF.autoTable.previous.finalY + 20);
        docPDF.text(`Điểm trung bình tích lũy thang 4: ${averageGrade4.toFixed(2)}`, 14, docPDF.autoTable.previous.finalY + 30);
        docPDF.text(`Xếp loại học tập toàn khóa: ${finalClassification}`, 14, docPDF.autoTable.previous.finalY + 40);
        docPDF.text("Xếp loại rèn luyện toàn khóa:", 14, docPDF.autoTable.previous.finalY + 50); // You may need to add this if you have the relevant data


        docPDF.text("4. Thông tin kết nối với văn bằng", 14, docPDF.autoTable.previous.finalY + 60);
        docPDF.text(`Mã số sinh viên: ${student.id}`, 14, docPDF.autoTable.previous.finalY + 70);
        docPDF.text(`Số hiệu văn bằng: 119/23`, 14, docPDF.autoTable.previous.finalY + 80);
        docPDF.text(`Số vào sổ: 119/23`, 14, docPDF.autoTable.previous.finalY + 90);
        docPDF.text(`Quyết định cấp bằng cử nhân: số 119/23`, 14, docPDF.autoTable.previous.finalY + 100);

        // Finalize document
        docPDF.text("Thành phố Hồ Chí Minh, ngày 03 tháng 08 năm 2024", 14, docPDF.autoTable.previous.finalY + 110);
        docPDF.text("HIỆU TRƯỞNG", 14, docPDF.autoTable.previous.finalY + 120);

        docPDF.save(`${student.name}_Hocba.pdf`);
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
            message.loading({ content: 'Đang tải danh sách môn học...', key: 'loadingCourses' });
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
            message.loading({ content: 'Đang tải danh sách sinh viên...', key: 'loadingStudents' });
            try {
                const studentSnapshot = await getDocs(collection(db, 'students'));
                const students: Student[] = studentSnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                }));
                setStudents(students);
                message.success({ content: 'Tải danh sách sinh viên thành công!', key: 'loadingStudents', duration: 2 });
            } catch (e) {
                message.error({ content: 'Tải danh sách sinh viên thất bại.', key: 'loadingStudents' });
                console.error('Failed to load students:', e);
            }
        };

        loadCourses();
        loadStudents();
    }, []);

    useEffect(() => {
        const fetchAllScores = async () => {
            if (!selectedStudent) return;
            message.loading({ content: 'Đang tải điểm sinh viên...', key: 'loadingScores' });
            const newScores: Record<string, StudentScore | null> = {};
            for (const record of coursesData) {
                newScores[record.code] = await fetchStudentScores(selectedStudent, record.code);
            }
            setStudentScores(newScores);
            message.success({ content: 'Tải điểm sinh viên thành công!', key: 'loadingScores', duration: 2 });
        };

        fetchAllScores();
    }, [selectedStudent, coursesData]);

    const handleStudentChange = async (value: string) => {
        setSelectedStudent(value);
    };


    const columns = [
        {
            title: 'Mã',
            dataIndex: 'code',
            width: '10%',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            width: '20%',
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
                const studentScore = studentScores[record.code];
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
        },
    ];
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
    }
    return (
        <div style={{ width: '100%', height: '100%', overflow: "auto" }}>
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
            {selectedStudent && (
                <SummaryComponent
                    studentScores={studentScores}
                    coursesData={coursesData}
                    selectedStudent={selectedStudent}
                />
            )}
        </div>
    );
}

export default Page;
