import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database'; // For Realtime Database
import { getFirestore } from 'firebase/firestore'; // For Firestore
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCYUtGmQynoXekqJFrfoqrtep68WxNlxNg",
  authDomain: "caito-rnd.firebaseapp.com",
  databaseURL: "https://caito-rnd-default-rtdb.firebaseio.com/",
  projectId: "caito-rnd",
  storageBucket: "caito-rnd.appspot.com",
  messagingSenderId: "596539065521",
  appId: "1:596539065521:web:401ffe38be9d9e21088e90",
  measurementId: "G-NECWW3P099"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const database = getDatabase(app);

// Initialize Firestore
export const db = getFirestore(app); // Firestore export

// Initialize Auth
export const auth = getAuth(app);

export default firebaseConfig;
