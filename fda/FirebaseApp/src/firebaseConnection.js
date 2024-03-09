// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCwVGEkzsX7stCP-4mR9mgiK56xq8aPQk",
  authDomain: "fda-rn.firebaseapp.com",
  projectId: "fda-rn",
  storageBucket: "fda-rn.appspot.com",
  messagingSenderId: "132540783874",
  appId: "1:132540783874:web:d7fbdd4245f39738c7f61b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { db, auth };
