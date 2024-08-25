'use client'
import React, {useState} from "react";
import {Button, Form, Input, InputNumber, Modal, Popconfirm, Spin, Table, TableProps, Typography} from "antd";
import {Simulate} from "react-dom/test-utils";
import cancel = Simulate.cancel;
import {useAuth} from "@/firebase/initFirebase";
import Link from "next/link";
const {Title} = Typography;

interface Student{
    studentId:string,
    name:string,
    // age: number,
    // classes:string[],
    classId:string,
    // courseList:string[],
    courseList:Course[],
}

const mockStudent:Student[]=[]
for(let i=1;i<100;++i)
{
    mockStudent.push({
        studentId:`Tom ${i}`,
        name:`Trang ${i}`,
        // age: i,
        // classes:["The practice of love","Conjuring the judge of hell"],
        classId:`Class ${i}`,
        // courseList:[`Course ${i}`],
        courseList:[{courseName:`Course ${i}`,grade:null}]
    })
}

// const mockStudents: Student[] = [
//     {
//         studentId: 'ST001',
//         name: 'Nguyen Van A',
//         // email: 'nguyenvana@example.com',
//         classId: 'Class_10A1',
//         courseList:['Course 1','Course 2'],
//         age: 17,
//     },
//     {
//         studentId: 'ST002',
//         name: 'Tran Thi B',
//         // email: 'tranthib@example.com',
//         classId: 'Class_10A2',
//         courseList:['Course 3','Course 4'],
//         age: 16,
//     },
//     {
//         studentId: 'ST003',
//         name: 'Le Van C',
//         // email: 'levanc@example.com',
//         classId: 'Class_11B1',
//         courseList:['Course 5','Course 6'],
//         age: 17,
//     },
//     {
//         studentId: 'ST004',
//         name: 'Pham Thi D',
//         // email: 'phamthid@example.com',
//         classId: 'Class_11B2',
//         courseList:['Course 7','Course 8'],
//         age: 16,
//     },
//     {
//         studentId: 'ST005',
//         name: 'Hoang Van E',
//         // email: 'hoangvane@example.com',
//         classId: 'Class_12C1',
//         courseList:['Course 9','Course 10'],
//         age: 18,
//     },
// ];

type Course = {
    courseName: string;
    grade: string | null;
};

const mockStudents: Student[] = [
    {
        studentId: "ST001",
        name: "Tran Thi BB",
        classId: "Class_12C2",
        courseList: [ 
            {
                courseName: "Course 8",
                grade: null
            },
            {
                courseName: "Course 3",
                grade: "D"
            },
            {
                courseName: "Course 4",
                grade: "B"
            },
            {
                courseName: "Course 11",
                grade: "A"
            },
            {
                courseName: "Course 6",
                grade: "C"
            },
            {
                courseName: "Course 10",
                grade: "F"
            },
            {
                courseName: "Course 7",
                grade: "C"
            },
            {
                courseName: "Course 12",
                grade: "B"
            },
            {
                courseName: "Course 1",
                grade: "F"
            },
            {
                courseName: "Course 5",
                grade: "A"
            },
            {
                courseName: "Course 2",
                grade: "D"
            },
            {
                courseName: "Course 9",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST002",
        name: "Le Van CC",
        classId: "Class_12C2",
        courseList: [
            {
                courseName: "Course 2",
                grade: "B"
            },
            {
                courseName: "Course 3",
                grade: null
            }
        ]
    },
    {
        studentId: "ST003",
        name: "Nguyen Van AA",
        classId: "Class_10A1",
        courseList: [
            {
                courseName: "Course 2",
                grade: "D"
            },
            {
                courseName: "Course 5",
                grade: "C"
            }
        ]
    },
    {
        studentId: "ST004",
        name: "Tran Van I",
        classId: "Class_11B2",
        courseList: [
            {
                courseName: "Course 11",
                grade: "C"
            },
            {
                courseName: "Course 3",
                grade: null
            }
        ]
    },
    {
        studentId: "ST005",
        name: "Nguyen Van A",
        classId: "Class_12C2",
        courseList: [
            {
                courseName: "Course 2",
                grade: "D"
            },
            {
                courseName: "Course 4",
                grade: "F"
            }
        ]
    },
    {
        studentId: "ST006",
        name: "Le Thi T",
        classId: "Class_10A1",
        courseList: [
            {
                courseName: "Course 9",
                grade: "C"
            },
            {
                courseName: "Course 1",
                grade: "A"
            }
        ]
    },
    {
        studentId: "ST007",
        name: "Le Van O",
        classId: "Class_12C2",
        courseList: [
            {
                courseName: "Course 6",
                grade: "D"
            },
            {
                courseName: "Course 5",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST008",
        name: "Hoang Thi V",
        classId: "Class_11B1",
        courseList: [
            {
                courseName: "Course 7",
                grade: "C"
            },
            {
                courseName: "Course 2",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST009",
        name: "Le Van CC",
        classId: "Class_12C1",
        courseList: [
            {
                courseName: "Course 6",
                grade: "F"
            },
            {
                courseName: "Course 8",
                grade: "A"
            }
        ]
    },
    {
        studentId: "ST010",
        name: "Pham Thi DD",
        classId: "Class_10A1",
        courseList: [
            {
                courseName: "Course 1",
                grade: "D"
            },
            {
                courseName: "Course 4",
                grade: "A"
            }
        ]
    },
    {
        studentId: "ST011",
        name: "Doan Van G",
        classId: "Class_10A2",
        courseList: [
            {
                courseName: "Course 8",
                grade: "F"
            },
            {
                courseName: "Course 4",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST012",
        name: "Nguyen Thi H",
        classId: "Class_10A2",
        courseList: [
            {
                courseName: "Course 3",
                grade: "A"
            },
            {
                courseName: "Course 4",
                grade: "F"
            }
        ]
    },
    {
        studentId: "ST013",
        name: "Tran Thi B",
        classId: "Class_10A2",
        courseList: [
            {
                courseName: "Course 4",
                grade: "D"
            },
            {
                courseName: "Course 10",
                grade: "A"
            }
        ]
    },
    {
        studentId: "ST014",
        name: "Bui Thi F",
        classId: "Class_11B2",
        courseList: [
            {
                courseName: "Course 9",
                grade: "D"
            },
            {
                courseName: "Course 11",
                grade: "C"
            }
        ]
    },
    {
        studentId: "ST015",
        name: "Hoang Van E",
        classId: "Class_10A1",
        courseList: [
            {
                courseName: "Course 1",
                grade: "A"
            },
            {
                courseName: "Course 4",
                grade: "C"
            }
        ]
    },
    {
        studentId: "ST016",
        name: "Hoang Thi V",
        classId: "Class_12C2",
        courseList: [
            {
                courseName: "Course 1",
                grade: "A"
            },
            {
                courseName: "Course 4",
                grade: null
            }
        ]
    },
    {
        studentId: "ST017",
        name: "Doan Van G",
        classId: "Class_12C1",
        courseList: [
            {
                courseName: "Course 7",
                grade: "F"
            },
            {
                courseName: "Course 12",
                grade: "C"
            }
        ]
    },
    {
        studentId: "ST018",
        name: "Le Van Y",
        classId: "Class_10A2",
        courseList: [
            {
                courseName: "Course 4",
                grade: "C"
            },
            {
                courseName: "Course 6",
                grade: null
            }
        ]
    },
    {
        studentId: "ST019",
        name: "Tran Thi BB",
        classId: "Class_12C2",
        courseList: [
            {
                courseName: "Course 2",
                grade: "B"
            },
            {
                courseName: "Course 5",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST020",
        name: "Tran Thi B",
        classId: "Class_10A2",
        courseList: [
            {
                courseName: "Course 6",
                grade: null
            },
            {
                courseName: "Course 4",
                grade: "A"
            }
        ]
    },
    {
        studentId: "ST021",
        name: "Nguyen Van AA",
        classId: "Class_11B2",
        courseList: [
            {
                courseName: "Course 9",
                grade: null
            },
            {
                courseName: "Course 11",
                grade: "D"
            }
        ]
    },
    {
        studentId: "ST022",
        name: "Pham Thi DD",
        classId: "Class_12C2",
        courseList: [
            {
                courseName: "Course 1",
                grade: "F"
            },
            {
                courseName: "Course 6",
                grade: "A"
            }
        ]
    },
    {
        studentId: "ST023",
        name: "Nguyen Van M",
        classId: "Class_10A1",
        courseList: [
            {
                courseName: "Course 10",
                grade: "C"
            },
            {
                courseName: "Course 3",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST024",
        name: "Pham Thi D",
        classId: "Class_11B2",
        courseList: [
            {
                courseName: "Course 7",
                grade: "D"
            },
            {
                courseName: "Course 2",
                grade: "C"
            }
        ]
    },
    {
        studentId: "ST025",
        name: "Tran Thi X",
        classId: "Class_10A1",
        courseList: [
            {
                courseName: "Course 9",
                grade: "C"
            },
            {
                courseName: "Course 3",
                grade: null
            }
        ]
    },
    {
        studentId: "ST026",
        name: "Nguyen Van A",
        classId: "Class_10A1",
        courseList: [
            {
                courseName: "Course 8",
                grade: "B"
            },
            {
                courseName: "Course 2",
                grade: "C"
            }
        ]
    },
    {
        studentId: "ST027",
        name: "Hoang Thi L",
        classId: "Class_10A2",
        courseList: [
            {
                courseName: "Course 8",
                grade: "C"
            },
            {
                courseName: "Course 2",
                grade: "F"
            }
        ]
    },
    {
        studentId: "ST028",
        name: "Pham Thi D",
        classId: "Class_10A1",
        courseList: [
            {
                courseName: "Course 2",
                grade: "D"
            },
            {
                courseName: "Course 1",
                grade: "F"
            }
        ]
    },
    {
        studentId: "ST029",
        name: "Le Thi T",
        classId: "Class_10A1",
        courseList: [
            {
                courseName: "Course 5",
                grade: "C"
            },
            {
                courseName: "Course 10",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST030",
        name: "Hoang Thi V",
        classId: "Class_12C2",
        courseList: [
            {
                courseName: "Course 3",
                grade: "C"
            },
            {
                courseName: "Course 8",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST031",
        name: "Nguyen Van M",
        classId: "Class_11B1",
        courseList: [
            {
                courseName: "Course 3",
                grade: "D"
            },
            {
                courseName: "Course 1",
                grade: "D"
            }
        ]
    },
    {
        studentId: "ST032",
        name: "Nguyen Van AA",
        classId: "Class_11B2",
        courseList: [
            {
                courseName: "Course 10",
                grade: "C"
            },
            {
                courseName: "Course 11",
                grade: "A"
            }
        ]
    },
    {
        studentId: "ST033",
        name: "Hoang Thi L",
        classId: "Class_12C1",
        courseList: [
            {
                courseName: "Course 2",
                grade: "A"
            },
            {
                courseName: "Course 7",
                grade: null
            }
        ]
    },
    {
        studentId: "ST034",
        name: "Le Van C",
        classId: "Class_11B2",
        courseList: [
            {
                courseName: "Course 11",
                grade: null
            },
            {
                courseName: "Course 10",
                grade: "F"
            }
        ]
    },
    {
        studentId: "ST035",
        name: "Hoang Van E",
        classId: "Class_10A2",
        courseList: [
            {
                courseName: "Course 7",
                grade: "F"
            },
            {
                courseName: "Course 9",
                grade: "F"
            }
        ]
    },
    {
        studentId: "ST036",
        name: "Le Van C",
        classId: "Class_10A1",
        courseList: [
            {
                courseName: "Course 1",
                grade: "A"
            },
            {
                courseName: "Course 6",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST037",
        name: "Nguyen Thi H",
        classId: "Class_12C1",
        courseList: [
            {
                courseName: "Course 6",
                grade: "B"
            },
            {
                courseName: "Course 3",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST038",
        name: "Tran Van I",
        classId: "Class_12C2",
        courseList: [
            {
                courseName: "Course 2",
                grade: null
            },
            {
                courseName: "Course 1",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST039",
        name: "Nguyen Thi R",
        classId: "Class_10A1",
        courseList: [
            {
                courseName: "Course 9",
                grade: "D"
            },
            {
                courseName: "Course 12",
                grade: null
            }
        ]
    },
    {
        studentId: "ST040",
        name: "Nguyen Van M",
        classId: "Class_12C1",
        courseList: [
            {
                courseName: "Course 3",
                grade: "F"
            },
            {
                courseName: "Course 9",
                grade: null
            }
        ]
    },
    {
        studentId: "ST041",
        name: "Pham Thi P",
        classId: "Class_11B1",
        courseList: [
            {
                courseName: "Course 7",
                grade: null
            },
            {
                courseName: "Course 4",
                grade: "A"
            }
        ]
    },
    {
        studentId: "ST042",
        name: "Pham Thi D",
        classId: "Class_12C2",
        courseList: [
            {
                courseName: "Course 3",
                grade: "A"
            },
            {
                courseName: "Course 10",
                grade: null
            }
        ]
    },
    {
        studentId: "ST043",
        name: "Hoang Van E",
        classId: "Class_10A2",
        courseList: [
            {
                courseName: "Course 11",
                grade: "D"
            },
            {
                courseName: "Course 9",
                grade: "A"
            }
        ]
    },
    {
        studentId: "ST044",
        name: "Le Van O",
        classId: "Class_11B2",
        courseList: [
            {
                courseName: "Course 4",
                grade: "F"
            },
            {
                courseName: "Course 3",
                grade: "C"
            }
        ]
    },
    {
        studentId: "ST045",
        name: "Tran Van I",
        classId: "Class_11B1",
        courseList: [
            {
                courseName: "Course 3",
                grade: "C"
            },
            {
                courseName: "Course 11",
                grade: "D"
            }
        ]
    },
    {
        studentId: "ST046",
        name: "Le Thi T",
        classId: "Class_11B2",
        courseList: [
            {
                courseName: "Course 10",
                grade: "A"
            },
            {
                courseName: "Course 12",
                grade: "D"
            }
        ]
    },
    {
        studentId: "ST047",
        name: "Hoang Van E",
        classId: "Class_10A2",
        courseList: [
            {
                courseName: "Course 1",
                grade: "D"
            },
            {
                courseName: "Course 11",
                grade: "F"
            }
        ]
    },
    {
        studentId: "ST048",
        name: "Hoang Van E",
        classId: "Class_11B1",
        courseList: [
            {
                courseName: "Course 1",
                grade: "D"
            },
            {
                courseName: "Course 8",
                grade: "D"
            }
        ]
    },
    {
        studentId: "ST049",
        name: "Pham Thi DD",
        classId: "Class_12C2",
        courseList: [
            {
                courseName: "Course 3",
                grade: "A"
            },
            {
                courseName: "Course 12",
                grade: "F"
            }
        ]
    },
    {
        studentId: "ST050",
        name: "Le Van O",
        classId: "Class_10A1",
        courseList: [
            {
                courseName: "Course 11",
                grade: "D"
            },
            {
                courseName: "Course 12",
                grade: "D"
            }
        ]
    },
    {
        studentId: "ST051",
        name: "Tran Thi X",
        classId: "Class_10A1",
        courseList: [
            {
                courseName: "Course 2",
                grade: "F"
            },
            {
                courseName: "Course 10",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST052",
        name: "Nguyen Thi R",
        classId: "Class_12C1",
        courseList: [
            {
                courseName: "Course 10",
                grade: null
            },
            {
                courseName: "Course 5",
                grade: "A"
            }
        ]
    },
    {
        studentId: "ST053",
        name: "Tran Van I",
        classId: "Class_10A1",
        courseList: [
            {
                courseName: "Course 5",
                grade: "F"
            },
            {
                courseName: "Course 10",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST054",
        name: "Pham Thi Z",
        classId: "Class_12C1",
        courseList: [
            {
                courseName: "Course 11",
                grade: null
            },
            {
                courseName: "Course 2",
                grade: null
            }
        ]
    },
    {
        studentId: "ST055",
        name: "Hoang Thi V",
        classId: "Class_10A2",
        courseList: [
            {
                courseName: "Course 5",
                grade: "D"
            },
            {
                courseName: "Course 2",
                grade: "A"
            }
        ]
    },
    {
        studentId: "ST056",
        name: "Nguyen Thi H",
        classId: "Class_10A1",
        courseList: [
            {
                courseName: "Course 6",
                grade: "A"
            },
            {
                courseName: "Course 5",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST057",
        name: "Pham Thi DD",
        classId: "Class_11B1",
        courseList: [
            {
                courseName: "Course 8",
                grade: null
            },
            {
                courseName: "Course 7",
                grade: "F"
            }
        ]
    },
    {
        studentId: "ST058",
        name: "Tran Thi N",
        classId: "Class_10A1",
        courseList: [
            {
                courseName: "Course 2",
                grade: "B"
            },
            {
                courseName: "Course 3",
                grade: "A"
            }
        ]
    },
    {
        studentId: "ST059",
        name: "Bui Thi F",
        classId: "Class_10A2",
        courseList: [
            {
                courseName: "Course 10",
                grade: "A"
            },
            {
                courseName: "Course 12",
                grade: null
            }
        ]
    },
    {
        studentId: "ST060",
        name: "Nguyen Van M",
        classId: "Class_10A1",
        courseList: [
            {
                courseName: "Course 11",
                grade: "C"
            },
            {
                courseName: "Course 3",
                grade: null
            }
        ]
    },
    {
        studentId: "ST061",
        name: "Nguyen Thi R",
        classId: "Class_10A2",
        courseList: [
            {
                courseName: "Course 12",
                grade: "F"
            },
            {
                courseName: "Course 9",
                grade: "C"
            }
        ]
    },
    {
        studentId: "ST062",
        name: "Tran Thi X",
        classId: "Class_11B1",
        courseList: [
            {
                courseName: "Course 11",
                grade: "D"
            },
            {
                courseName: "Course 1",
                grade: "C"
            }
        ]
    },
    {
        studentId: "ST063",
        name: "Nguyen Van A",
        classId: "Class_12C1",
        courseList: [
            {
                courseName: "Course 10",
                grade: "A"
            },
            {
                courseName: "Course 9",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST064",
        name: "Pham Thi D",
        classId: "Class_10A1",
        courseList: [
            {
                courseName: "Course 1",
                grade: null
            },
            {
                courseName: "Course 8",
                grade: "A"
            }
        ]
    },
    {
        studentId: "ST065",
        name: "Tran Van S",
        classId: "Class_10A1",
        courseList: [
            {
                courseName: "Course 7",
                grade: "C"
            },
            {
                courseName: "Course 8",
                grade: null
            }
        ]
    },
    {
        studentId: "ST066",
        name: "Tran Thi BB",
        classId: "Class_12C2",
        courseList: [
            {
                courseName: "Course 2",
                grade: "F"
            },
            {
                courseName: "Course 10",
                grade: "F"
            }
        ]
    },
    {
        studentId: "ST067",
        name: "Pham Thi P",
        classId: "Class_11B1",
        courseList: [
            {
                courseName: "Course 7",
                grade: "D"
            },
            {
                courseName: "Course 10",
                grade: "F"
            }
        ]
    },
    {
        studentId: "ST068",
        name: "Nguyen Thi R",
        classId: "Class_11B1",
        courseList: [
            {
                courseName: "Course 6",
                grade: "B"
            },
            {
                courseName: "Course 10",
                grade: "C"
            }
        ]
    },
    {
        studentId: "ST069",
        name: "Nguyen Thi H",
        classId: "Class_11B2",
        courseList: [
            {
                courseName: "Course 6",
                grade: "C"
            },
            {
                courseName: "Course 12",
                grade: "C"
            }
        ]
    },
    {
        studentId: "ST070",
        name: "Bui Thi F",
        classId: "Class_12C1",
        courseList: [
            {
                courseName: "Course 8",
                grade: "A"
            },
            {
                courseName: "Course 11",
                grade: "D"
            }
        ]
    },
    {
        studentId: "ST071",
        name: "Pham Thi DD",
        classId: "Class_11B2",
        courseList: [
            {
                courseName: "Course 9",
                grade: "F"
            },
            {
                courseName: "Course 10",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST072",
        name: "Le Thi T",
        classId: "Class_12C1",
        courseList: [
            {
                courseName: "Course 4",
                grade: "C"
            },
            {
                courseName: "Course 10",
                grade: "F"
            }
        ]
    },
    {
        studentId: "ST073",
        name: "Tran Thi B",
        classId: "Class_11B2",
        courseList: [
            {
                courseName: "Course 1",
                grade: null
            },
            {
                courseName: "Course 4",
                grade: "F"
            }
        ]
    },
    {
        studentId: "ST074",
        name: "Nguyen Van AA",
        classId: "Class_10A2",
        courseList: [
            {
                courseName: "Course 6",
                grade: "A"
            },
            {
                courseName: "Course 7",
                grade: "C"
            }
        ]
    },
    {
        studentId: "ST075",
        name: "Doan Van G",
        classId: "Class_12C2",
        courseList: [
            {
                courseName: "Course 10",
                grade: "F"
            },
            {
                courseName: "Course 5",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST076",
        name: "Tran Thi BB",
        classId: "Class_12C2",
        courseList: [
            {
                courseName: "Course 10",
                grade: "B"
            },
            {
                courseName: "Course 12",
                grade: "D"
            }
        ]
    },
    {
        studentId: "ST077",
        name: "Nguyen Van AA",
        classId: "Class_11B1",
        courseList: [
            {
                courseName: "Course 9",
                grade: "F"
            },
            {
                courseName: "Course 2",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST078",
        name: "Nguyen Van AA",
        classId: "Class_12C1",
        courseList: [
            {
                courseName: "Course 1",
                grade: "B"
            },
            {
                courseName: "Course 8",
                grade: "C"
            }
        ]
    },
    {
        studentId: "ST079",
        name: "Pham Thi Z",
        classId: "Class_10A2",
        courseList: [
            {
                courseName: "Course 6",
                grade: "B"
            },
            {
                courseName: "Course 9",
                grade: "D"
            }
        ]
    },
    {
        studentId: "ST080",
        name: "Nguyen Thi R",
        classId: "Class_12C1",
        courseList: [
            {
                courseName: "Course 2",
                grade: null
            },
            {
                courseName: "Course 8",
                grade: "F"
            }
        ]
    },
    {
        studentId: "ST081",
        name: "Nguyen Van M",
        classId: "Class_11B1",
        courseList: [
            {
                courseName: "Course 10",
                grade: null
            },
            {
                courseName: "Course 11",
                grade: "C"
            }
        ]
    },
    {
        studentId: "ST082",
        name: "Nguyen Van W",
        classId: "Class_11B1",
        courseList: [
            {
                courseName: "Course 11",
                grade: "F"
            },
            {
                courseName: "Course 6",
                grade: "C"
            }
        ]
    },
    {
        studentId: "ST083",
        name: "Pham Van K",
        classId: "Class_11B1",
        courseList: [
            {
                courseName: "Course 8",
                grade: "C"
            },
            {
                courseName: "Course 3",
                grade: null
            }
        ]
    },
    {
        studentId: "ST084",
        name: "Tran Van I",
        classId: "Class_11B1",
        courseList: [
            {
                courseName: "Course 9",
                grade: "A"
            },
            {
                courseName: "Course 4",
                grade: "F"
            }
        ]
    },
    {
        studentId: "ST085",
        name: "Tran Van I",
        classId: "Class_10A2",
        courseList: [
            {
                courseName: "Course 5",
                grade: "C"
            },
            {
                courseName: "Course 3",
                grade: null
            }
        ]
    },
    {
        studentId: "ST086",
        name: "Pham Thi D",
        classId: "Class_11B2",
        courseList: [
            {
                courseName: "Course 10",
                grade: "C"
            },
            {
                courseName: "Course 12",
                grade: "D"
            }
        ]
    },
    {
        studentId: "ST087",
        name: "Nguyen Thi R",
        classId: "Class_11B2",
        courseList: [
            {
                courseName: "Course 9",
                grade: "B"
            },
            {
                courseName: "Course 7",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST088",
        name: "Le Van C",
        classId: "Class_11B1",
        courseList: [
            {
                courseName: "Course 11",
                grade: "D"
            },
            {
                courseName: "Course 7",
                grade: "D"
            }
        ]
    },
    {
        studentId: "ST089",
        name: "Nguyen Van AA",
        classId: "Class_11B1",
        courseList: [
            {
                courseName: "Course 7",
                grade: "D"
            },
            {
                courseName: "Course 3",
                grade: null
            }
        ]
    },
    {
        studentId: "ST090",
        name: "Hoang Van Q",
        classId: "Class_12C1",
        courseList: [
            {
                courseName: "Course 5",
                grade: "F"
            },
            {
                courseName: "Course 2",
                grade: "D"
            }
        ]
    },
    {
        studentId: "ST091",
        name: "Nguyen Van A",
        classId: "Class_11B1",
        courseList: [
            {
                courseName: "Course 11",
                grade: "A"
            },
            {
                courseName: "Course 6",
                grade: "D"
            }
        ]
    },
    {
        studentId: "ST092",
        name: "Pham Thi P",
        classId: "Class_12C1",
        courseList: [
            {
                courseName: "Course 8",
                grade: "D"
            },
            {
                courseName: "Course 5",
                grade: "A"
            }
        ]
    },
    {
        studentId: "ST093",
        name: "Pham Thi P",
        classId: "Class_11B2",
        courseList: [
            {
                courseName: "Course 3",
                grade: "D"
            },
            {
                courseName: "Course 1",
                grade: null
            }
        ]
    },
    {
        studentId: "ST094",
        name: "Nguyen Van W",
        classId: "Class_10A2",
        courseList: [
            {
                courseName: "Course 3",
                grade: "F"
            },
            {
                courseName: "Course 11",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST095",
        name: "Pham Van U",
        classId: "Class_11B2",
        courseList: [
            {
                courseName: "Course 2",
                grade: null
            },
            {
                courseName: "Course 8",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST096",
        name: "Pham Van U",
        classId: "Class_12C2",
        courseList: [
            {
                courseName: "Course 3",
                grade: "F"
            },
            {
                courseName: "Course 8",
                grade: "F"
            }
        ]
    },
    {
        studentId: "ST097",
        name: "Hoang Van Q",
        classId: "Class_10A2",
        courseList: [
            {
                courseName: "Course 11",
                grade: "B"
            },
            {
                courseName: "Course 4",
                grade: "B"
            }
        ]
    },
    {
        studentId: "ST098",
        name: "Le Thi T",
        classId: "Class_10A2",
        courseList: [
            {
                courseName: "Course 5",
                grade: "B"
            },
            {
                courseName: "Course 3",
                grade: "D"
            }
        ]
    },
    {
        studentId: "ST099",
        name: "Pham Thi DD",
        classId: "Class_11B1",
        courseList: [
            {
                courseName: "Course 8",
                grade: "D"
            },
            {
                courseName: "Course 9",
                grade: "F"
            }
        ]
    },
    {
        studentId: "ST100",
        name: "Nguyen Van A",
        classId: "Class_11B1",
        courseList: [
            {
                courseName: "Course 4",
                grade: null
            },
            {
                courseName: "Course 12",
                grade: null
            }
        ]
    }
];

const {Search} = Input;

interface editableCellProps extends React.HTMLAttributes<HTMLElement>{
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number'|'text';
    record: Student;
    index: number;
}
const editableCell: React.FC<React.PropsWithChildren<editableCellProps>> = (
    {
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }
)=>{
    const inputNode= inputType==='number'? <InputNumber/>: <Input/>;
    return (
        <td {...restProps}>
            {editing?(
                <Form.Item
                    name={dataIndex}
                    style={{margin:0}}
                    rules={[{
                        required:true,
                        message:`Vui lòng nhập ${title}!`,
                    }]}
                >
                    {inputNode}
                </Form.Item>
            ):(
                children
            )}
        </td>
    )
}

export default function Page(){
    const {user,loading}= useAuth();
    console.log('user information',user);
    if(loading)
    {
        return <Spin size="large"/>
    }
    if(!user)
    {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign:'center',
            }}>
                <Title level={2} style={{marginBottom:'24px',color:'#1677ff'}}>Vui lòng đăng nhập trước khi truy cập nội dung</Title>
                <Link href="/dashboard" passHref>
                    <Button type="primary" size="large">Đăng nhập</Button>
                </Link>
            </div>
        )
    }
    const [form]=Form.useForm();
    const [data,setData]=React.useState(mockStudents);
    const [editingID,setEditingID]=useState('');
    const [searchText,setSearchText]=useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const isEditing= (record:Student) => record.studentId==editingID;

    const edit =(record: Partial<Student> & {studentId: React.Key}) => {
        form.setFieldsValue({
            name:'',
            age:'',
            ...record
        })
        setEditingID(record.studentId);
    };

    const cancel =()=>{
        setEditingID('');
    }

    const save= async (id: React.Key) => {
        try {
            const row = (await form.validateFields()) as Student;
            const newData = [...data];
            const index = data.findIndex((record: Student) => record.studentId === id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                })
            }
            setData(newData);
            setEditingID('');
        }catch (e)
        {
            console.log('Có vấn đề khi chỉnh sửa hàng, xem student.tsx',e);
        }
    }

    const handleSearch = (value: string) => {
        setSearchText(value);
        const filteredData = mockStudents.filter(record =>
            record.name.toLowerCase().includes(value.toLowerCase()) ||
            record.studentId.toLowerCase().includes(value.toLowerCase()) ||
            record.classId.toLowerCase().includes(value.toLowerCase()) ||
            record.courseList.join('').toLowerCase().includes(value.toLowerCase())
        );
        setData(filteredData);
    };

    const showModal = (student: any) => {
        setSelectedStudent(student);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns=[
        {
            title:'Mã Sinh Viên',
            dataIndex:'studentId',
            width:'20%',
            editable:true,
        },
        {
            title:'Tên',
            dataIndex:'name',
            width:'20%',
            editable:true,
        },
        // {
        //     title:'Tuổi',
        //     dataIndex:'age',
        //     width:'20%',
        //     editable:true,
        // },
        {
            title:'Mã Lớp',
            dataIndex:'classId',
            width:'20%',
            editable:true,
        },
        {
            title:'Các Lớp Đã Đăng Ký',
            dataIndex:'courseList',
            width:'20%',
            editable:true,
            render: (courseList: { courseName: string, grade: string | null }[]) => {
                return (
                    <div
                        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}
                        onClick={() => showModal(courseList)}
                    >
                        {courseList.map(course => course.courseName).join(', ')}
                    </div>
                );
            }
        },
        {
            title :'Thao tác',
            dataIndex: 'operation',
            render: (_:any, record:Student)=>{
                const editable=isEditing(record);
                return editable? (
                    <span>
                    <Typography.Link onClick={()=>{save(record.studentId)}} style={{marginInlineEnd:8}}>
                        Lưu
                    </Typography.Link>
                        <Popconfirm title="Bạn có chắc muốn hủy?" onConfirm ={cancel}>
                            <a> Hủy</a>
                        </Popconfirm>
                    </span>
                ):(
                    <Typography.Link
                        disabled={editingID!==''}
                        onClick={()=>{edit(record)}}>
                        Sửa
                    </Typography.Link>
                )
            }
        }
    ]

    const mergedColumns:TableProps<Student>['columns']=columns.map((col)=>{
        if(!col.editable)
        {
            return col;
        }else {
            return {
                ...col,
                onCell:(record:Student)=>({
                    record,
                    inputType: col.dataIndex ==='age'?'number': 'text',
                    dataIndex: col.dataIndex,
                    title:col.title,
                    editing: isEditing(record)
                })
            }
        }
    });

    return (
        <div>
            <Search
                placeholder="Tìm kiếm sinh viên"
                enterButton="Tìm kiếm"
                value={searchText}
                onChange={e => handleSearch(e.target.value)}
                style={{ marginBottom: 20 }}
            />
            <Form
                form={form}
                component={false}
            >
                <Table
                    components={{
                        body: {
                            cell: editableCell,
                        },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName={"editable-row"}
                    pagination={{onChange:cancel}}
                    scroll={{y:'calc(100vh - 300px)'}}
                >

                </Table>
            </Form>
            <Modal
                title="Thông tin chi tiết"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                {selectedStudent && (
                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {selectedStudent.map((course: { courseName: string, grade: string | null }) => (
                            <div key={course.courseName}>
                                <p><strong>Khóa học:</strong> {course.courseName}</p>
                                <p><strong>Điểm:</strong> {course.grade ? course.grade : 'Chưa có điểm'}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </div>
    );
}
