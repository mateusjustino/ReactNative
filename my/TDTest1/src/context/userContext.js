import { createContext, useState } from "react";

export const UserContext = createContext({});

export default function UserContextProvider({ children }) {
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [user, setUser] = useState({});

  return (
    <UserContext.Provider
      value={{ selectedNotes, setSelectedNotes, user, setUser }}
    >
      {children}
    </UserContext.Provider>
  );
}
