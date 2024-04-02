import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAtbxxdxnPL8e6n8QNbND0rJC7Iq4UOn4c",
  authDomain: "heygrupos-15d8b.firebaseapp.com",
  projectId: "heygrupos-15d8b",
  storageBucket: "heygrupos-15d8b.appspot.com",
  messagingSenderId: "403793313401",
  appId: "1:403793313401:web:f88a567be465e41f771ea8",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
