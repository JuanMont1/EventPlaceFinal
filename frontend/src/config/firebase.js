import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage'; 

const firebaseConfig = {
  apiKey: "AIzaSyBCXQeRB-5tnDENDXi5VvZwf2lKvS-Hfls",
  authDomain: "eventplace-c539b.firebaseapp.com",
  projectId: "eventplace-c539b",
  storageBucket: "eventplace-c539b.firebasestorage.app",
  messagingSenderId: "777817319788",
  appId: "1:777817319788:web:ee3caff6b4d22c9de5eb49",
  measurementId: "G-6WP2E78XXV"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app); 
export const ADMIN_EMAILS = ['anonimo7510@gmail.com', 'otroadmin@example.com'];
