// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNO5-92mgR54QwR66kL0sA9UmVcsFVdzw",
  authDomain: "poll-3efce.firebaseapp.com",
  projectId: "poll-3efce",
  storageBucket: "poll-3efce.firebasestorage.app",
  messagingSenderId: "932109518570",
  appId: "1:932109518570:web:66a7294e4b0dbfe9463993",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
