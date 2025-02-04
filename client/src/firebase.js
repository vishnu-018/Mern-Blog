// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-e12a7.firebaseapp.com",
  projectId: "mern-blog-e12a7",
  storageBucket: "mern-blog-e12a7.firebasestorage.app",
  messagingSenderId: "740513520107",
  appId: "1:740513520107:web:cd382aa9ed1a0ec6b8e1ae"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
