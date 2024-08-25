import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "@firebase/firestore";
import { db } from "@/firebase/initFirebase"; // Import your initialized Firestore instance

// Interface for the Lecturer
interface Lecturer {
    lecturerId: string;
    name: string;
    email: string;
    classes: string[];
}

// Create a new lecturer
export const createLecturer = async (lecturerData: Lecturer) => {
    try {
        await addDoc(collection(db, "lecturers"), lecturerData);
        console.log("Lecturer created successfully");
    } catch (error) {
        console.error("Cannot create lecturer", error);
    }
};

// Read all lecturers
export const readLectures = async (): Promise<Lecturer[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, "lecturers"));
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                lecturerId: doc.id,
                name: data.name || '',
                email: data.email || '',
                classes: data.classes || []
            };
        });
    } catch (error) {
        console.error("Error reading lecturers", error);
        return []; // Return an empty array if there's an error
    }
};

// Update a lecturer
export const updateLecturer = async (lecturerId: string, updatedData: Partial<Lecturer>) => {
    const lecturerRef = doc(db, "lecturers", lecturerId);
    try {
        await updateDoc(lecturerRef, updatedData);
        console.log("Lecturer updated successfully");
    } catch (error) {
        console.error("Error updating lecturer: ", error);
    }
};

// Delete a lecturer
export const deleteLecturer = async (lecturerId: string) => {
    try {
        await deleteDoc(doc(db, "lecturers", lecturerId));
        console.log("Lecturer deleted successfully");
    } catch (error) {
        console.error("Error deleting lecturer: ", error);
    }
};
