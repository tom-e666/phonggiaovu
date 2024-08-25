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
import {getFirestore} from "@firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD63rIxkccmGD3JGJ0rvL_44EczmcgkrkA",
    authDomain: "phonggv-3913a.firebaseapp.com",
    projectId: "phonggv-3913a",
    storageBucket: "phonggv-3913a.appspot.com",
    messagingSenderId: "32359212335",
    appId: "1:32359212335:web:dbf584517ed6b41989adda"
};
const app = initializeApp(firebaseConfig);
export default app;
export const db = getFirestore();

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





