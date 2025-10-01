// FIX: Replaced placeholder content with a valid Firebase initialization module.
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// In a production app, you should use environment variables to keep these keys secure.
const firebaseConfig = {
  apiKey: "AIzaSyBv5MpzuKHjyDVlbE53THuBvjsefroOUEA",
  authDomain: "knoweachother-ba559.firebaseapp.com",
  projectId: "knoweachother-ba559",
  storageBucket: "knoweachother-ba559.appspot.com",
  messagingSenderId: "419270503667",
  appId: "1:419270503667:web:98029aa8d9c30b42f69b86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exports for Firebase services
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
