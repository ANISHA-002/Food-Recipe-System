import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDzcwsYqiBjFZQQ_9E1jJirGPvUJ_Ry9UE",
    authDomain: "food-recipe-system-34e9f.firebaseapp.com",
    projectId: "food-recipe-system-34e9f",
    storageBucket: "food-recipe-system-34e9f.firebasestorage.app",
    messagingSenderId: "787514250539",
    appId: "1:787514250539:web:07d0870acfb8a46057e16e",
    measurementId: "G-JW90ZW8XCR"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
