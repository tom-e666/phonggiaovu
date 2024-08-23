'use client';

import React, { useEffect, useState } from 'react';
import { retrieveClassArray } from '@/app/class/class';

import {Form, Input, InputNumber, Popconfirm, Table, TableProps, Typography} from "antd";
interface Class { //exported from class.tsx
    id: string;
    name: string;
    lecture: string;
    students: string[];
    schedule: { [key: string]: any };
}
const mockData:Class[]=[];
for(let i=0;i<100;++i)
{
    mockData.push({
        id:i.toString(),
        name: `Tom ${i}`,
        lecture: `Trang ${i}`,
        students: ['Tom','Trang','\@ will be replaced by link'],
        schedule:{[1]:"Tuesday 7am:9am A111", [2]:"Wednesday 13am:15am A111" },
    });
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement>{
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number'| 'text';
    record: Class;
    index: number;
}
const editableCell :React.FC<React.PropsWithChildren<EditableCellProps>> =
    ({
    editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
}) =>{
    const inputNode= inputType === 'number'? <InputNumber/>: <Input/>;
    return (
        <td {...restProps}>
            {editing? (
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

    };
function Page(){
    //form, data,
    const [form]=Form.useForm();
    const [data,setData]=useState(mockData);
    const [editingID,setEditingID]=useState('');
    const isEditing= (record:Class) => record.id==editingID;
    const edit =(record: Partial<Class> & {id: React.Key}) => {
        form.setFieldsValue({
            name:'',
            lecture:'',
            ...record,
        })
        setEditingID(record.id);

    }
    const cancel =()=>{
        setEditingID('');
    }
    const save= async (id:React.Key)=>{
        try{
           const row= (await form.validateFields()) as Class;
           const newData=[...data];
           const index= newData.findIndex((item:Class)=>id===item.id);
           if(index>-1)
           {
               const item= newData[index];
               newData.splice(index, 1,{
                   ...item,
                   ...row,
               })
           }
           setData(newData);
           setEditingID('');
        }catch(e){
            console.log("validate fail",e);
        }
    }
    const columns=[
        {
            title:'Name',
            dataIndex:'name',
            width:'20%',
            editable:true,
        },
        {
            title:'Lecture',
            dataIndex:'lecture',
            width: '20%',
            editable: true,
        },
        {
            title:'See Student List',
            dataIndex:'students',
            width: '20%',
            editable: false,
            render:(students:string[])=>{
                return students.join(', ')
            }
        },
        {
            title:'Schedule',
            dataIndex:'schedule',
            width: '20%',
            editable: false,
            render:(schedule:{[key:string]:string})=>{
                return Object.values(schedule).join('\n');
            }
        },
        {
            title :'Operation',
            dataIndex: 'operation',
            render: (_:any, record:Class)=>{
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
    const mergedColumns: TableProps<Class>['columns']=columns.map((col)=>{
        if(!col.editable)
        {
            return col;
        }
        return{
            ...col,
            onCell:(record:Class)=>({
                record,
                inputType: col.dataIndex ='text',
                dataIndex: col.dataIndex,
                title:col.title,
                editing: isEditing(record)
            })
        };
    });
    return (
        <div style={{
            width:'100%',
            height:'100%',
        }}>
       <Form
       form={form}
       component={false}
       >
           <Table
           components={{
               body:{
                   cell:editableCell,
               },
           }}
           bordered
           dataSource={data}
           columns={mergedColumns}
           rowClassName="editable-row"
           pagination={{onChange:cancel}}
           scroll={{y:'calc(100vh - 300px)'}}

           >
           </Table>

       </Form>
        </div>
    )
}
export default Page;
