import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "@firebase/firestore";
import { db } from "@/firebase/initFirebase";

// Class interface with students as a string array (IDs)
export interface Class {
    id: string;
    name: string;
    lecture: string;
    students: string[];
    schedule: { [key: string]: any };
}

// Create a class
const createClass = async (newClass: Omit<Class, 'id'>) => {
    try {
        const classCollectionRef = collection(db, "Class");
        const docRef = await addDoc(classCollectionRef, {
            name: newClass.name,
            lecture: newClass.lecture,
            students: newClass.students,
            schedule: newClass.schedule,
        });
        console.log(`Class ${newClass.name} added to DB with ID: ${docRef.id}`);
    } catch (error) {
        console.error("Error adding document:", error);
    }
};

// Retrieve all classes as an array of Class objects
const retrieveClassArray: () => Promise<Class[]> = async () => {
    const classArray: Class[] = [];
    try {
        const classSnapshot = await getDocs(collection(db, "Class"));
        classSnapshot.forEach((classDoc) => {
            const classData = classDoc.data() as Omit<Class, 'id'>;
            classArray.push({
                id: classDoc.id,
                ...classData,
            });
        });
        console.log("Retrieved classes successfully");
        return classArray;
    } catch (error) {
        console.error("Error retrieving documents:", error);
        throw error;
    }
};

// Update a class by ID
const updateClass = async (classID: string, updateData: Partial<Class>) => {
    try {
        const classRef = doc(db, "Class", classID);
        await updateDoc(classRef, updateData);
        console.log(`Class with ID ${classID} updated successfully`);
    } catch (error) {
        console.error("Error updating document:", error);
        throw error;
    }
};

// Delete a class by ID
const deleteClass = async (classID: string) => {
    try {
        const classRef = doc(db, "Class", classID);
        const docSnap=await getDoc(classRef);
        if(!docSnap.exists())
        {
            console.log(`Class with ID ${classID} doesn't exist`);
            return;
        }
        await deleteDoc(classRef);
        console.log(`Class with ID ${classID} deleted successfully`);
    } catch (error) {
        console.error("Error deleting document:", error);
        throw error;
    }
};
export { createClass, retrieveClassArray, updateClass, deleteClass };
