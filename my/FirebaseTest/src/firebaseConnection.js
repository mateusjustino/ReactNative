import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBRYSRO9KGl-d0YcXvjE_W2kBV-qoWiU-0",
  authDomain: "my-firebase-test-19110.firebaseapp.com",
  projectId: "my-firebase-test-19110",
  storageBucket: "my-firebase-test-19110.appspot.com",
  messagingSenderId: "880965147031",
  appId: "1:880965147031:web:47a1f45584baa885714cd2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth, db };
