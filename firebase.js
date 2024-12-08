// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzPVXTJ_RNVJojBu9I4dF8Qtt_856JPZo",
  authDomain: "big-barden.firebaseapp.com",
  projectId: "big-barden",
  storageBucket: "big-barden.appspot.com",
  messagingSenderId: "312318392294",
  appId: "1:312318392294:web:97e307d0634b9643ef0827",
  measurementId: "G-4E4TH3VD2X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };