// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {initializeApp} from "firebase/app";
import {
    browserLocalPersistence,
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    setPersistence,
    signInWithEmailAndPassword,
    signOut,
    User
} from "firebase/auth";
import 'firebase/firestore';
import 'firebase/auth';
import {createContext} from "node:vm";
import React, {ReactNode, useContext, useEffect} from "react";
import {useRouter} from "next/router";
import {router} from "next/client";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAdpV8EibD1mmsG7H6qOmOBCjQqWunF15I",
    authDomain: "phonggiaovu-3349b.firebaseapp.com",
    databaseURL: "https://phonggiaovu-3349b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "phonggiaovu-3349b",
    storageBucket: "phonggiaovu-3349b.appspot.com",
    messagingSenderId: "645695908790",
    appId: "1:645695908790:web:92762c74c9662c62e42f17",
    measurementId: "G-68R771J6LP"
};
const app = initializeApp(firebaseConfig);
export default app;


interface AuthContextProps {
    user: User | null;
    loading: boolean;
}
const instance: AuthContextProps ={
    user:null,
    loading:false,
}
interface AuthProviderProps{
    children:ReactNode;
}
const AuthContext = React.createContext<AuthContextProps|undefined>(undefined);
export const useAuth=()=>{
    const context= React.useContext(AuthContext);
    if(!context)
    {
        console.log('failed to retrieve user context');
        throw new Error();
    }
    return context;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);
    useEffect(() => {
        const auth = getAuth();
        // Set up the listener for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
        if(loading){
            return (
                <>
                loading animation, stacked and performed later;
                </>
            )
        }
    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}





