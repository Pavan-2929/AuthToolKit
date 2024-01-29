// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// dotenv.config()
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-authtoolkit.firebaseapp.com",
  projectId: "mern-authtoolkit",
  storageBucket: "mern-authtoolkit.appspot.com",
  messagingSenderId: "259085245053",
  appId: "1:259085245053:web:80795b61057f2dcfceaf14",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
