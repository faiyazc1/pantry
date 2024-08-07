// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxKWsCa9Uk6bQ_To1yvZapF_-XJepqX9M",
  authDomain: "pantry-9a9a7.firebaseapp.com",
  projectId: "pantry-9a9a7",
  storageBucket: "pantry-9a9a7.appspot.com",
  messagingSenderId: "901871282713",
  appId: "1:901871282713:web:38b0612a4c62db5a749888"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };