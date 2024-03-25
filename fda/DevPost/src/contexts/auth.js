import { useState, createContext, useEffect } from "react";
import { auth, db } from "../firebaseConnection";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as signOutFirebase,
} from "firebase/auth";
import { setDoc, doc, collection, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(false);

  useEffect(() => {
    async function loadStorage() {
      const storageUser = await AsyncStorage.getItem("@devapp");

      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }
      setLoading(false);
    }
    loadStorage();
  }, []);

  async function signUp(email, password, name) {
    setLoadingAuth(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid;
        await setDoc(doc(db, "users", uid), {
          nome: name,
          createdAt: new Date(),
        }).then(() => {
          let data = {
            uid: uid,
            nome: name,
            email: value.user.email,
          };
          setUser(data);
          storageUser(data);
          setLoadingAuth(false);
        });
      })
      .catch((error) => {
        console.log(error);
        setLoadingAuth(false);
      });
  }

  async function signIn(email, password) {
    setLoadingAuth(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid;
        // const userProfile = await collection(db, "users").doc(uid).get();
        const userProfile = await getDoc(doc(db, "users", uid));
        // console.log(userProfile.data().nome);
        let data = {
          uid: uid,
          nome: userProfile.data().nome,
          email: value.user.email,
        };
        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
      })
      .catch((error) => {
        alert(error.message);
        setLoadingAuth(false);
      });
  }

  async function signOut() {
    await signOutFirebase(auth);
    await AsyncStorage.clear().then(() => setUser(null));
  }

  async function storageUser(data) {
    await AsyncStorage.setItem("@devapp", JSON.stringify(data));
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        signUp,
        signIn,
        signOut,
        loadingAuth,
        loading,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
