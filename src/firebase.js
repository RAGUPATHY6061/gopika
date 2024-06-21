// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore'; // Import initializeFirestore

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCL97zEvAzeefNeIz0qEDekVyiDSHTYOX8",
  authDomain: "backend-e4934.firebaseapp.com",
  projectId: "backend-e4934",
  storageBucket: "backend-e4934.appspot.com",
  messagingSenderId: "574022602277",
  appId: "1:574022602277:web:a31bf33f78d6ad6e9239cc",
  measurementId: "G-5VGNQPLW82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics if needed
const analytics = getAnalytics(app);

// Initialize Firestore with timestampsInSnapshots settings
const db = initializeFirestore(app, { 
  experimentalForceLongPolling: true, 
  timestampsInSnapshots: true 
});

// Initialize Firebase Authentication
const auth = getAuth(app);

export { auth, db };
