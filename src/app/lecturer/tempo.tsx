import {createLecturer} from "@/app/lecturer/crud";
import {message} from "antd";

interface Lecturer {
    lecturerId: string;
    name: string;
    email: string;
    classes: string[];
}

const mockLecturers: Lecturer[] = [];
for (let i = 1; i <= 100; ++i) {
    mockLecturers.push({
        lecturerId: `Lecturer ${i}`,
        name: `Lecturer Name ${i}`,
        email: `lecturer${i}@example.com`,
        classes: ["Class101", "Class102"],
    });
}
export default function ggg(){
    try{
        mockLecturers.map(lecture=>{createLecturer(lecture)});
        message.success("Lecturer created");
    }catch(e){
        message.error("push failed");
    }

}