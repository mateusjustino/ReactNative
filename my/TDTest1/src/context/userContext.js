import { createContext, useState } from "react";

export const UserContext = createContext({});

export default function UserContextProvider({ children }) {
  const [selectedNotes, setSelectedNotes] = useState([]);

  return (
    <UserContext.Provider value={{ selectedNotes, setSelectedNotes }}>
      {children}
    </UserContext.Provider>
  );
}
