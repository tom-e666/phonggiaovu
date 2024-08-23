'use client'
import React, {useState} from "react";
import {Form, Input, InputNumber, Popconfirm, Table, TableProps, Typography} from "antd";
import {Simulate} from "react-dom/test-utils";
import cancel = Simulate.cancel;
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
                        message:`Please Input ${title} !`,
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
            console.log('there is problem with editing rows, see student.tsx',e);
        }
    }


    const columns=[
        {
            title:'ID',
            dataIndex:'id',
            width:'20%',
            editable:true,
        },
        {
            title:'Name',
            dataIndex:'id',
            width:'20%',
            editable:true,
        },
        {
            title:'Age',
            dataIndex:'age',
            width:'20%',
            editable:true,
        },
        {
            title:'Enrolled Classes',
            dataIndex:'classes',
            width:'20%',
            editable:true,
            render:(classes:string[])=>{
               return  classes.join('\n')
            }
        },
        {
            title :'Operation',
            dataIndex: 'operation',
            render: (_:any, record:Student)=>{
                const editable=isEditing(record);
                return editable? (
                    <span>
                    <Typography.Link onClick={()=>{save(record.id)}} style={{marginInlineEnd:8}}>
                        Save
                    </Typography.Link>
                        <Popconfirm title="Are you sure want to cancel?" onConfirm ={cancel}>
                            <a> Cancel</a>
                        </Popconfirm>
                    </span>
                ):(
                    <Typography.Link
                        disabled={editingID!==''}
                        onClick={()=>{edit(record)}}>
                        Edit
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