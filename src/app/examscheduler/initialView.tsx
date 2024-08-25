'use client';

import React, { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "@/firebase/initFirebase"; // Ensure this is your initialized Firestore instance

interface CourseView {
    id: string;        // Course ID
    name: string;      // Course name
    studentCount: number; // Total number of students in the course
}

const CoursesTable: React.FC = () => {
    const [courses, setCourses] = useState<CourseView[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const classesSnapshot = await getDocs(collection(db, "classes"));

                const courseMap = new Map<string, CourseView>();

                classesSnapshot.docs.forEach(doc => {
                    const data = doc.data();
                    const key = data.code ;

                    if (courseMap.has(key)) {
                        const existingCourse = courseMap.get(key)!;
                        existingCourse.studentCount += data.capacity || 30;
                    } else {

                        courseMap.set(key, {
                            id: data.code ,
                            name: data.name || '',
                            studentCount: data.capacity || 0,
                        });
                    }
                });

                setCourses(Array.from(courseMap.values()));
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch courses", error);
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // Define the table columns
    const columns = [
        {
            title: 'Mã Môn Học',
            dataIndex: 'id',
            key: 'id',
            width: '30%',
        },
        {
            title: 'Tên Môn Học',
            dataIndex: 'name',
            key: 'name',
            width: '50%',
        },
        {
            title: 'Số Lượng Sinh Viên',
            dataIndex: 'studentCount',
            key: 'studentCount',
            width: '20%',
        },
    ];
    return loading ? (
        <Spin size="large" />
    ) : (
        <Table
            bordered
            dataSource={courses}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            rowClassName="editable-row"
            scroll={{ y: 'calc(100vh - 300px)' }}
        />
    );
}

export default CoursesTable;
