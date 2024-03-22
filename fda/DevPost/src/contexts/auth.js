import { useState, createContext } from "react";
import { auth, db } from "../firebaseConnection";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, collection, addDoc } from "firebase/firestore";

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function signUp(email, password, name) {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid;
        await addDoc(collection(db, "users", uid), {
          nome: name,
          createdAt: new Date(),
        }).then(() => {
          let data = {
            uid: uid,
            nome: name,
            email: value.user.email,
          };
          setUser(data);
        });
      })
      .catch((error) => console.log(error));
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}
