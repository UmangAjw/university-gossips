// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBX5v5CDs9L-SV7y9b0-97hObDe06HX_KE",
  authDomain: "university-gossips.firebaseapp.com",
  projectId: "university-gossips",
  storageBucket: "university-gossips.appspot.com",
  messagingSenderId: "976701704716",
  appId: "1:976701704716:web:cb969736c0e79e7a9ffc29",
  measurementId: "G-JY17V9WYY7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
