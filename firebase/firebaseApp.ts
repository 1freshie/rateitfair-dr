import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9fRJG68MXVbxVY61oMWUH3EJmSyzkWk0",
  authDomain: "rateitfair.firebaseapp.com",
  projectId: "rateitfair",
  storageBucket: "rateitfair.appspot.com",
  messagingSenderId: "565867015135",
  appId: "1:565867015135:web:9708aa9df498f8fd50326a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
