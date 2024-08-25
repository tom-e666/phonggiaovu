'use client'
import {pushClasses, pushCourse, pushLecturer, pushRoom, UploadRoomsButton} from "@/app/dashboard/mockdata.";
import {Button} from "antd";
import {collection, getDocs} from "@firebase/firestore";
import {db} from "@/firebase/initFirebase";

export default function page()
{

    const cus= async (collName:string)=>{
        const roomCol= collection(db,collName);
        const snapShot= await getDocs(roomCol);
        return snapShot.docs.map(doc=>({id:doc.id,...doc.data()}));
    }
    return (
        <>
        <Button onClick={pushCourse}>
        push Course
        </Button>
            <Button onClick={pushLecturer}>push Lecturer</Button>
            <Button onClick={pushRoom}>push Room</Button>
            <Button onClick={pushClasses}>push Class</Button>
            <UploadRoomsButton/>
        </>
    )
}