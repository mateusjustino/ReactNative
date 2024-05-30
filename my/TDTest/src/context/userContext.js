import { createContext, useEffect, useState } from "react";
import moment from "moment-timezone";

export const UserContext = createContext({});

export default function UserContextProvider({ children }) {
  const [timezone, setTimezone] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedNotes, setSelectedNotes] = useState([]);

  useEffect(() => {
    const fetchTimezone = () => {
      const userTimezone = moment.tz.guess();
      setTimezone(userTimezone);
    };

    fetchTimezone();
    console.log("useeffect do context executado");

    // Cleanup
    return () => {
      // any cleanup code
    };
  }, []);

  return (
    <UserContext.Provider value={{ selectedNotes, setSelectedNotes }}>
      {children}
    </UserContext.Provider>
  );
}
