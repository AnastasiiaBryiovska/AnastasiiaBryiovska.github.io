// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJJDQNleNvkyq21kpyO9n1n8Q-wlFWSpg",
  authDomain: "courses-4d7e9.firebaseapp.com",
  projectId: "courses-4d7e9",
  databaseURL: "https://courses-4d7e9-default-rtdb.firebaseio.com/",
  storageBucket: "courses-4d7e9.firebasestorage.app",
  messagingSenderId: "569791852659",
  appId: "1:569791852659:web:153871bbdb009e9493fa06",
  measurementId: "G-QWFWGLLCX5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);