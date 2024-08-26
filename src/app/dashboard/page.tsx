'use client'
import {
    pushClasses,
    pushCourse,
    pushLecturer,
    pushRoom,
    PushStudentsButton,
    UploadRoomsButton
} from "@/app/dashboard/mockdata.";
import {Button} from "antd";
import React from "react";
export default function page()
{
    return (
        <>
        <Button onClick={pushCourse}>
        push Course
        </Button>
            <Button onClick={pushLecturer}>push Lecturer</Button>
            <Button onClick={pushRoom}>push Room</Button>
            <Button onClick={pushClasses}>push Class</Button>
            <UploadRoomsButton/>
            <PushStudentsButton/>
        </>
    )
}