// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUeSzU_dlBUjcpRFRpHDSuKT9zp4BNpc0",
  authDomain: "thinkdoapp.firebaseapp.com",
  projectId: "thinkdoapp",
  storageBucket: "thinkdoapp.appspot.com",
  messagingSenderId: "689220032081",
  appId: "1:689220032081:web:ccd3820975b1f65f1d8a70",
  measurementId: "G-B6556RKJJ3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { db, auth };
