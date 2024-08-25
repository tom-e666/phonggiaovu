'use client'
import React, {useState} from "react";
import {Button, Form, Input, InputNumber, Popconfirm, Spin, Table, TableProps, Typography} from "antd";
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
    courseList:string[],
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
        courseList:[`Course ${i}`],
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

const mockStudents: Student[] = [
    {
        studentId: "ST001",
        name: "Pham Thi D",
        classId: "Class_11B1",
        courseList: [
            "Course 7",
            "Course 10"
        ]
    },
    {
        studentId: "ST002",
        name: "Le Van Y",
        classId: "Class_10A2",
        courseList: [
            "Course 7",
            "Course 2"
        ]
    },
    {
        studentId: "ST003",
        name: "Pham Thi DD",
        classId: "Class_11B2",
        courseList: [
            "Course 3",
            "Course 9",
        ]
    },
    {
        studentId: "ST004",
        name: "Nguyen Van AA",
        classId: "Class_10A1",
        courseList: [
            "Course 3",
            "Course 11"
        ]
    },
    {
        studentId: "ST005",
        name: "Nguyen Van M",
        classId: "Class_10A1",
        courseList: [
            "Course 8",
            "Course 3"
        ]
    },
    {
        studentId: "ST006",
        name: "Le Van CC",
        classId: "Class_10A1",
        courseList: [
            "Course 9",
            "Course 2"
        ]
    },
    {
        studentId: "ST007",
        name: "Le Van O",
        classId: "Class_12C2",
        courseList: [
            "Course 9",
            "Course 2"
        ]
    },
    {
        studentId: "ST008",
        name: "Pham Van U",
        classId: "Class_12C1",
        courseList: [
            "Course 5",
            "Course 9"
        ]
    },
    {
        studentId: "ST009",
        name: "Pham Thi D",
        classId: "Class_11B2",
        courseList: [
            "Course 2",
            "Course 12"
        ]
    },
    {
        studentId: "ST010",
        name: "Hoang Thi L",
        classId: "Class_12C1",
        courseList: [
            "Course 1",
            "Course 5"
        ]
    },
    {
        studentId: "ST011",
        name: "Nguyen Van A",
        classId: "Class_12C1",
        courseList: [
            "Course 6",
            "Course 5"
        ]
    },
    {
        studentId: "ST012",
        name: "Hoang Thi L",
        classId: "Class_11B1",
        courseList: [
            "Course 9",
            "Course 6"
        ]
    },
    {
        studentId: "ST013",
        name: "Nguyen Van AA",
        classId: "Class_12C1",
        courseList: [
            "Course 11",
            "Course 3"
        ]
    },
    {
        studentId: "ST014",
        name: "Nguyen Van M",
        classId: "Class_11B2",
        courseList: [
            "Course 7",
            "Course 11"
        ]
    },
    {
        studentId: "ST015",
        name: "Nguyen Van A",
        classId: "Class_11B1",
        courseList: [
            "Course 8",
            "Course 2"
        ]
    },
    {
        studentId: "ST016",
        name: "Le Van CC",
        classId: "Class_12C2",
        courseList: [
            "Course 3",
            "Course 11"
        ]
    },
    {
        studentId: "ST017",
        name: "Le Van CC",
        classId: "Class_10A2",
        courseList: [
            "Course 11",
            "Course 4"
        ]
    },
    {
        studentId: "ST018",
        name: "Le Van CC",
        classId: "Class_12C2",
        courseList: [
            "Course 10",
            "Course 3"
        ]
    },
    {
        studentId: "ST019",
        name: "Tran Van S",
        classId: "Class_12C2",
        courseList: [
            "Course 8",
            "Course 5"
        ]
    },
    {
        studentId: "ST020",
        name: "Pham Thi D",
        classId: "Class_10A2",
        courseList: [
            "Course 9",
            "Course 6"
        ]
    },
    {
        studentId: "ST021",
        name: "Doan Van G",
        classId: "Class_11B2",
        courseList: [
            "Course 3",
            "Course 11"
        ]
    },
    {
        studentId: "ST022",
        name: "Nguyen Thi R",
        classId: "Class_10A1",
        courseList: [
            "Course 11",
            "Course 4"
        ]
    },
    {
        studentId: "ST023",
        name: "Le Van CC",
        classId: "Class_11B2",
        courseList: [
            "Course 10",
            "Course 7"
        ]
    },
    {
        studentId: "ST024",
        name: "Pham Thi DD",
        classId: "Class_10A2",
        courseList: [
            "Course 4",
            "Course 5"
        ]
    },
    {
        studentId: "ST025",
        name: "Tran Thi N",
        classId: "Class_12C1",
        courseList: [
            "Course 12",
            "Course 10"
        ]
    },
    {
        studentId: "ST026",
        name: "Tran Van I",
        classId: "Class_11B2",
        courseList: [
            "Course 7",
            "Course 4"
        ]
    },
    {
        studentId: "ST027",
        name: "Le Thi J",
        classId: "Class_10A2",
        courseList: [
            "Course 6",
            "Course 5"
        ]
    },
    {
        studentId: "ST028",
        name: "Tran Thi X",
        classId: "Class_10A1",
        courseList: [
            "Course 3",
            "Course 6"
        ]
    },
    {
        studentId: "ST029",
        name: "Hoang Thi L",
        classId: "Class_12C2",
        courseList: [
            "Course 1",
            "Course 12"
        ]
    },
    {
        studentId: "ST030",
        name: "Hoang Thi L",
        classId: "Class_10A2",
        courseList: [
            "Course 3",
            "Course 11"
        ]
    },
    {
        studentId: "ST031",
        name: "Pham Van K",
        classId: "Class_11B2",
        courseList: [
            "Course 5",
            "Course 9"
        ]
    },
    {
        studentId: "ST032",
        name: "Pham Van U",
        classId: "Class_10A1",
        courseList: [
            "Course 10",
            "Course 3"
        ]
    },
    {
        studentId: "ST033",
        name: "Le Thi J",
        classId: "Class_12C1",
        courseList: [
            "Course 10",
            "Course 1"
        ]
    },
    {
        studentId: "ST034",
        name: "Tran Thi BB",
        classId: "Class_10A2",
        courseList: [
            "Course 7",
            "Course 2"
        ]
    },
    {
        studentId: "ST035",
        name: "Pham Thi DD",
        classId: "Class_10A2",
        courseList: [
            "Course 1",
            "Course 6"
        ]
    },
    {
        studentId: "ST036",
        name: "Tran Thi X",
        classId: "Class_11B2",
        courseList: [
            "Course 12",
            "Course 10"
        ]
    },
    {
        studentId: "ST037",
        name: "Tran Thi B",
        classId: "Class_11B2",
        courseList: [
            "Course 6",
            "Course 12"
        ]
    },
    {
        studentId: "ST038",
        name: "Tran Thi BB",
        classId: "Class_10A2",
        courseList: [
            "Course 10",
            "Course 5"
        ]
    },
    {
        studentId: "ST039",
        name: "Hoang Thi L",
        classId: "Class_10A1",
        courseList: [
            "Course 3",
            "Course 5"
        ]
    },
    {
        studentId: "ST040",
        name: "Le Van O",
        classId: "Class_11B2",
        courseList: [
            "Course 5",
            "Course 6"
        ]
    },
    {
        studentId: "ST041",
        name: "Le Van O",
        classId: "Class_10A2",
        courseList: [
            "Course 1",
            "Course 12"
        ]
    },
    {
        studentId: "ST042",
        name: "Nguyen Van W",
        classId: "Class_12C1",
        courseList: [
            "Course 5",
            "Course 8"
        ]
    },
    {
        studentId: "ST043",
        name: "Le Van CC",
        classId: "Class_10A1",
        courseList: [
            "Course 7",
            "Course 9"
        ]
    },
    {
        studentId: "ST044",
        name: "Tran Van I",
        classId: "Class_12C1",
        courseList: [
            "Course 11",
            "Course 6"
        ]
    },
    {
        studentId: "ST045",
        name: "Nguyen Van A",
        classId: "Class_12C1",
        courseList: [
            "Course 3",
            "Course 8"
        ]
    },
    {
        studentId: "ST046",
        name: "Hoang Thi L",
        classId: "Class_10A1",
        courseList: [
            "Course 4",
            "Course 11"
        ]
    },
    {
        studentId: "ST047",
        name: "Tran Thi BB",
        classId: "Class_10A2",
        courseList: [
            "Course 10",
            "Course 8"
        ]
    },
    {
        studentId: "ST048",
        name: "Nguyen Van A",
        classId: "Class_12C1",
        courseList: [
            "Course 12",
            "Course 5"
        ]
    },
    {
        studentId: "ST049",
        name: "Hoang Thi V",
        classId: "Class_11B1",
        courseList: [
            "Course 8",
            "Course 7"
        ]
    },
    {
        studentId: "ST050",
        name: "Nguyen Thi R",
        classId: "Class_11B1",
        courseList: [
            "Course 5",
            "Course 11"
        ]
    },
    {
        studentId: "ST051",
        name: "Nguyen Van M",
        classId: "Class_11B2",
        courseList: [
            "Course 10",
            "Course 9"
        ]
    },
    {
        studentId: "ST052",
        name: "Hoang Thi V",
        classId: "Class_12C1",
        courseList: [
            "Course 7",
            "Course 4"
        ]
    },
    {
        studentId: "ST053",
        name: "Le Van CC",
        classId: "Class_12C2",
        courseList: [
            "Course 12",
            "Course 6"
        ]
    },
    {
        studentId: "ST054",
        name: "Le Van Y",
        classId: "Class_10A2",
        courseList: [
            "Course 11",
            "Course 10"
        ]
    },
    {
        studentId: "ST055",
        name: "Tran Thi B",
        classId: "Class_11B1",
        courseList: [
            "Course 3",
            "Course 4"
        ]
    },
    {
        studentId: "ST056",
        name: "Tran Thi BB",
        classId: "Class_10A1",
        courseList: [
            "Course 4",
            "Course 7"
        ]
    },
    {
        studentId: "ST057",
        name: "Nguyen Van AA",
        classId: "Class_10A2",
        courseList: [
            "Course 1",
            "Course 11"
        ]
    },
    {
        studentId: "ST058",
        name: "Tran Thi X",
        classId: "Class_11B1",
        courseList: [
            "Course 1",
            "Course 3"
        ]
    },
    {
        studentId: "ST059",
        name: "Hoang Thi V",
        classId: "Class_12C2",
        courseList: [
            "Course 9",
            "Course 11"
        ]
    },
    {
        studentId: "ST060",
        name: "Pham Thi P",
        classId: "Class_10A1",
        courseList: [
            "Course 11",
            "Course 10"
        ]
    },
    {
        studentId: "ST061",
        name: "Nguyen Van M",
        classId: "Class_12C2",
        courseList: [
            "Course 8",
            "Course 6"
        ]
    },
    {
        studentId: "ST062",
        name: "Pham Thi D",
        classId: "Class_11B2",
        courseList: [
            "Course 1",
            "Course 3"
        ]
    },
    {
        studentId: "ST063",
        name: "Le Van Y",
        classId: "Class_10A2",
        courseList: [
            "Course 8",
            "Course 10"
        ]
    },
    {
        studentId: "ST064",
        name: "Doan Van G",
        classId: "Class_12C2",
        courseList: [
            "Course 4",
            "Course 2"
        ]
    },
    {
        studentId: "ST065",
        name: "Le Thi T",
        classId: "Class_12C1",
        courseList: [
            "Course 11",
            "Course 12"
        ]
    },
    {
        studentId: "ST066",
        name: "Le Van O",
        classId: "Class_10A2",
        courseList: [
            "Course 10",
            "Course 11"
        ]
    },
    {
        studentId: "ST067",
        name: "Pham Thi DD",
        classId: "Class_10A1",
        courseList: [
            "Course 2",
            "Course 7"
        ]
    },
    {
        studentId: "ST068",
        name: "Pham Thi DD",
        classId: "Class_12C2",
        courseList: [
            "Course 8",
            "Course 11"
        ]
    },
    {
        studentId: "ST069",
        name: "Tran Thi BB",
        classId: "Class_10A2",
        courseList: [
            "Course 9",
            "Course 3"
        ]
    },
    {
        studentId: "ST070",
        name: "Hoang Van Q",
        classId: "Class_12C1",
        courseList: [
            "Course 10",
            "Course 9"
        ]
    },
    {
        studentId: "ST071",
        name: "Tran Thi N",
        classId: "Class_11B1",
        courseList: [
            "Course 11",
            "Course 6"
        ]
    },
    {
        studentId: "ST072",
        name: "Le Van O",
        classId: "Class_11B2",
        courseList: [
            "Course 9",
            "Course 11"
        ]
    },
    {
        studentId: "ST073",
        name: "Nguyen Van AA",
        classId: "Class_10A1",
        courseList: [
            "Course 3",
            "Course 5"
        ]
    },
    {
        studentId: "ST074",
        name: "Tran Thi B",
        classId: "Class_12C2",
        courseList: [
            "Course 10",
            "Course 2"
        ]
    },
    {
        studentId: "ST075",
        name: "Hoang Van E",
        classId: "Class_10A2",
        courseList: [
            "Course 7",
            "Course 11"
        ]
    },
    {
        studentId: "ST076",
        name: "Le Van C",
        classId: "Class_11B2",
        courseList: [
            "Course 6",
            "Course 7"
        ]
    },
    {
        studentId: "ST077",
        name: "Bui Thi F",
        classId: "Class_10A1",
        courseList: [
            "Course 2",
            "Course 8"
        ]
    },
    {
        studentId: "ST078",
        name: "Pham Van K",
        classId: "Class_10A2",
        courseList: [
            "Course 11",
            "Course 6"
        ]
    },
    {
        studentId: "ST079",
        name: "Hoang Van E",
        classId: "Class_12C2",
        courseList: [
            "Course 8",
            "Course 4"
        ]
    },
    {
        studentId: "ST080",
        name: "Le Van CC",
        classId: "Class_10A1",
        courseList: [
            "Course 9",
            "Course 3"
        ]
    },
    {
        studentId: "ST081",
        name: "Nguyen Van W",
        classId: "Class_10A2",
        courseList: [
            "Course 4",
            "Course 5"
        ]
    },
    {
        studentId: "ST082",
        name: "Hoang Van E",
        classId: "Class_11B2",
        courseList: [
            "Course 3",
            "Course 6"
        ]
    },
    {
        studentId: "ST083",
        name: "Tran Thi BB",
        classId: "Class_11B1",
        courseList: [
            "Course 11",
            "Course 7"
        ]
    },
    {
        studentId: "ST084",
        name: "Pham Van U",
        classId: "Class_11B1",
        courseList: [
            "Course 7",
            "Course 10"
        ]
    },
    {
        studentId: "ST085",
        name: "Le Van CC",
        classId: "Class_10A1",
        courseList: [
            "Course 3",
            "Course 7"
        ]
    },
    {
        studentId: "ST086",
        name: "Nguyen Van M",
        classId: "Class_11B1",
        courseList: [
            "Course 9",
            "Course 7"
        ]
    },
    {
        studentId: "ST087",
        name: "Tran Thi X",
        classId: "Class_10A1",
        courseList: [
            "Course 6",
            "Course 2"
        ]
    },
    {
        studentId: "ST088",
        name: "Le Van O",
        classId: "Class_10A2",
        courseList: [
            "Course 7",
            "Course 8"
        ]
    },
    {
        studentId: "ST089",
        name: "Tran Thi N",
        classId: "Class_12C1",
        courseList: [
            "Course 6",
            "Course 8"
        ]
    },
    {
        studentId: "ST090",
        name: "Hoang Thi V",
        classId: "Class_11B2",
        courseList: [
            "Course 7",
            "Course 1"
        ]
    },
    {
        studentId: "ST091",
        name: "Tran Van I",
        classId: "Class_10A1",
        courseList: [
            "Course 3",
            "Course 7"
        ]
    },
    {
        studentId: "ST092",
        name: "Le Van C",
        classId: "Class_10A1",
        courseList: [
            "Course 9",
            "Course 11"
        ]
    },
    {
        studentId: "ST093",
        name: "Le Van Y",
        classId: "Class_11B1",
        courseList: [
            "Course 4",
            "Course 2"
        ]
    },
    {
        studentId: "ST094",
        name: "Tran Van S",
        classId: "Class_11B1",
        courseList: [
            "Course 5",
            "Course 8"
        ]
    },
    {
        studentId: "ST095",
        name: "Tran Thi N",
        classId: "Class_11B2",
        courseList: [
            "Course 7",
            "Course 2"
        ]
    },
    {
        studentId: "ST096",
        name: "Tran Thi B",
        classId: "Class_11B1",
        courseList: [
            "Course 2",
            "Course 8"
        ]
    },
    {
        studentId: "ST097",
        name: "Pham Van U",
        classId: "Class_11B2",
        courseList: [
            "Course 3",
            "Course 2"
        ]
    },
    {
        studentId: "ST098",
        name: "Le Van C",
        classId: "Class_10A2",
        courseList: [
            "Course 11",
            "Course 4"
        ]
    },
    {
        studentId: "ST099",
        name: "Nguyen Van W",
        classId: "Class_11B1",
        courseList: [
            "Course 11",
            "Course 12"
        ]
    },
    {
        studentId: "ST100",
        name: "Hoang Thi V",
        classId: "Class_12C1",
        courseList: [
            "Course 9",
            "Course 3"
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
            render:(courseList:string[])=>{
                return  courseList.join('\n')
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
        </div>
    );
}
