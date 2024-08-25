import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "@firebase/firestore";
import { db } from "@/firebase/initFirebase"; // Import your initialized db

interface Student {
    id: string;
    name: string;
    age: number;
    classes: string[];
}

// Create a new student
export const createStudent = async (studentData: Student) => {
    try {
        const docRef = await addDoc(collection(db, "students"), studentData);
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
};

// Read all students
export const readStudents = async (): Promise<Student[]> => {
    const querySnapshot = await getDocs(collection(db, "students"));
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name || '',
            age: data.age || 0,
            classes: data.classes || []
        };
    });
};

// Update an existing student
export const updateStudent = async (studentId: string, updatedData: Partial<Student>) => {
    const studentRef = doc(db, "students", studentId);
    try {
        await updateDoc(studentRef, updatedData);
        console.log("Student updated successfully");
    } catch (e) {
        console.error("Error updating document: ", e);
    }
};

// Delete a student
export const deleteStudent = async (studentId: string) => {
    try {
        await deleteDoc(doc(db, "students", studentId));
        console.log("Student deleted successfully");
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
};
