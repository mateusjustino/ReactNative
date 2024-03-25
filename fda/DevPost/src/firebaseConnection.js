// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbtNc1-kCXXO9FNFo2GzZbV1yL6L4icTA",
  authDomain: "devpost-afc8b.firebaseapp.com",
  projectId: "devpost-afc8b",
  storageBucket: "devpost-afc8b.appspot.com",
  messagingSenderId: "198428830158",
  appId: "1:198428830158:web:8e2f31f94b86ea4effa39f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const storage = getStorage(app, "devpost-afc8b.appspot.com");

export { db, auth, storage };
