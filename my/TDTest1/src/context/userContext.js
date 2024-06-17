import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db } from "../firebaseConnection";

export const UserContext = createContext({});

export default function UserContextProvider({ children }) {
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [user, setUser] = useState({});
  const [tags, setTags] = useState([]);
  const [statusBarColor, setStatusBarColor] = useState("#f2f2f2");

  const EnterUser = async (userInfo) => {
    setUser(userInfo);

    const docRef = doc(db, "settings", userInfo.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let list = docSnap.data().tags;
      list.sort((a, b) => a.localeCompare(b));
      setTags(list);
    } else {
      setTags([]);
    }
  };

  return (
    <UserContext.Provider
      value={{
        selectedNotes,
        setSelectedNotes,
        user,
        setUser,
        EnterUser,
        tags,
        setTags,
        statusBarColor,
        setStatusBarColor,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
