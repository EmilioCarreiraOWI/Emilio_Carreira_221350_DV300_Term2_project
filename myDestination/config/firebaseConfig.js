// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'; //set up auth functionality
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-AK36wZeWHAdDarJWlTGX-rWRY3YYFG0",
  authDomain: "mydestination-20c09.firebaseapp.com",
  projectId: "mydestination-20c09",
  storageBucket: "mydestination-20c09.appspot.com",
  messagingSenderId: "320337074688",
  appId: "1:320337074688:web:1bc54bc88f39f234f156e5",
  measurementId: "G-KQQ0GSP7DE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

