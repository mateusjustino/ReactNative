import { createContext, useState } from "react";

export const Context = createContext({});

export default function Provider({ children }) {
  const [email, setEmail] = useState("");
  return (
    <Context.Provider value={{ nome: "Mateus", email, setEmail }}>
      {children}
    </Context.Provider>
  );
}
