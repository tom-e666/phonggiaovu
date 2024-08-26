import {collection, getDocs} from "@firebase/firestore";
import {db} from "@/firebase/initFirebase";
interface StudentClass {
    id: string;
    name: string;
    take1: number | null; // Score for the first attempt
    take2: number | null; // Score for the second attempt
}
export interface Class  {
    id: string;
    code: string;
    name: string;
    term: string;
    year: number;
    lecturer?: string;
    lecturerID?: string;
    location?: string;
    schedule?: string[];
    description?: string;
    prerequisites?: string;
    capacity?: number;
    students?:StudentClass[];
}

export const retrieveClasses = async (): Promise<Class[]> => {
    try {
        const classSnapShot = await getDocs(collection(db, "classes"));
        return classSnapShot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,  // Using doc.id to ensure the correct ID is used
                code: data.code || '',
                name: data.name || '',
                term: data.term || '',
                year: data.year || 0,
                lecturer: data.lecturer || '',
                lecturerID: data.lecturerID || '',
                location: data.location || '',
                schedule: data.schedule || [],
                description: data.description || '',
                prerequisites: data.prerequisites || '',
                capacity: data.capacity || 0
            };
        });
    } catch (error) {
        console.log("Failed to load classes content", error);
        throw error;
    }
};
