// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJsJiKI2GDEdNoEGp0hHa3OJ1TnySl7pY",
  authDomain: "self-tape-battle.firebaseapp.com",
  projectId: "self-tape-battle",
  storageBucket: "self-tape-battle.appspot.com",
  messagingSenderId: "746282940351",
  appId: "1:746282940351:web:d117a1a8a7c94cd27e130a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "default-clone-new");
export const storage = getStorage(app);
const analytics = getAnalytics(app);
