// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import {collection, connectFirestoreEmulator, getFirestore} from "@firebase/firestore";
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
const db=getFirestore();
if (process.env.NODE_ENV === "development") {
    connectFirestoreEmulator(db, "localhost", 8080);
}
export {db}


