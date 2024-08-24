'use client'
import React, {useState} from "react";
import {Button, Form, Input, InputNumber, Popconfirm, Spin, Table, TableProps, Typography} from "antd";
import {Simulate} from "react-dom/test-utils";
import cancel = Simulate.cancel;
import {useAuth} from "@/firebase/initFirebase";
import Link from "next/link";
const {Title} = Typography;

interface Student{
    id:string,
    name:string,
    age: number,
    classes:string[],
}

const mockStudent:Student[]=[]
for(let i=1;i<100;++i)
{
    mockStudent.push({
        id:`Tom ${i}`,
        name:`Trang ${i}`,
        age: i,
        classes:["The practice of love","Conjuring the judge of hell"],
    })
}

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
    const [data,setData]=React.useState(mockStudent);
    const [editingID,setEditingID]=useState('');
    const isEditing= (record:Student) => record.id==editingID;

    const edit =(record: Partial<Student> & {id: React.Key}) => {
        form.setFieldsValue({
            name:'',
            age:'',
            ...record
        })
        setEditingID(record.id);
    };

    const cancel =()=>{
        setEditingID('');
    }

    const save= async (id: React.Key) => {
        try {
            const row = (await form.validateFields()) as Student;
            const newData = [...data];
            const index = data.findIndex((record: Student) => record.id === id);
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

    const columns=[
        {
            title:'Mã Sinh Viên',
            dataIndex:'id',
            width:'20%',
            editable:true,
        },
        {
            title:'Tên',
            dataIndex:'name',
            width:'20%',
            editable:true,
        },
        {
            title:'Tuổi',
            dataIndex:'age',
            width:'20%',
            editable:true,
        },
        {
            title:'Các Lớp Đã Đăng Ký',
            dataIndex:'classes',
            width:'20%',
            editable:true,
            render:(classes:string[])=>{
                return  classes.join('\n')
            }
        },
        {
            title :'Thao tác',
            dataIndex: 'operation',
            render: (_:any, record:Student)=>{
                const editable=isEditing(record);
                return editable? (
                    <span>
                    <Typography.Link onClick={()=>{save(record.id)}} style={{marginInlineEnd:8}}>
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
