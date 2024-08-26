'use client'
import {
    pushClasses,
    pushCourse,
    pushLecturer,
    pushRoom,
    PushStudentsButton, UpdateAllStudents, updateClassSchedule,
    UploadRoomsButton
} from "@/app/dashboard/mockdata.";
import {Button} from "antd";
import React from "react";
export default function page()
{
    return (
        <div>
        <Button style={{marginRight:'10px',marginBottom:'10px'}} onClick={pushCourse}>
        push Course
        </Button>
            <Button style={{marginRight:'10px',marginBottom:'10px'}} onClick={pushLecturer}>push Lecturer</Button>
            <Button style={{marginRight:'10px',marginBottom:'10px'}} onClick={pushRoom}>push Room</Button>
            <Button style={{marginRight:'10px',marginBottom:'10px'}} onClick={pushClasses}>push Class</Button>
            <UploadRoomsButton/>
            <PushStudentsButton/>
            <Button style={{marginRight:'10px',marginBottom:'10px'}} onClick={UpdateAllStudents}>update student</Button>
            <Button style={{marginRight:'10px',marginBottom:'10px'}} onClick={updateClassSchedule}>update class schedule</Button>

        </div>
    )
}