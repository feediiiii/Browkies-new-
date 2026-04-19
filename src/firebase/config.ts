// Firebase configuration
// Replace these values with your Firebase project credentials
// To create a Firebase project: https://console.firebase.google.com/

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey:"AIzaSyBTb4i1H0gKPJ2Twj2_cdSuWmpkr-2iF5g",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cookies-business.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cookies-business",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cookies-business.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "90432462816",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:90432462816:web:2da6cb28c821f511711585"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
