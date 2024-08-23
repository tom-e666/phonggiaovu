import React from "react";
import {classList} from "@/app/components/tempdata";
import {Button, Form, Input} from "antd";
export const ClassList =()=>{
//     retrieve data from server
    const [classes, setClasses] = React.useState(classList);
    return (
        <>
            <h1> Class List</h1>
            <ul>
                {classes.map((cls, index)=>(
                    <li key={index}>{cls.name}</li>
                    ))}
            </ul>
        </>
    )
}
export const AddClass=()=>{
    const [ClassID,setClassID] = React.useState("");
    const [ClassName, setClassName] = React.useState("");
    const [Major,setMajor] = React.useState("");
    const [Faculty,setFaculty] = React.useState("");
    //handle submit here with async
    return (
        <Form>
            <h2> Add Class</h2>
            <Input
            type="text"
            value={ClassID}
            onChange={(e) => setClassID(e.target.value)}
            placeholder="Class Code"/>
            <Input
            type="text"
            value={ClassName}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Class Name"/>
            <Input
            type="text"
            value={Major}
            onChange={(e) => setMajor(e.target.value)}
            placeholder="Major"/>
            <Input
            type="text"
            value={Faculty}
            onChange={(e) => setFaculty(e.target.value)}
            placeholder="Faculty"/>
            <Button type="dashed" htmlType="submit">Add Class</Button>
        </Form>
    )
}
export const RemoveClass= async (classId: string)=>{
// code with database to delete class
}
