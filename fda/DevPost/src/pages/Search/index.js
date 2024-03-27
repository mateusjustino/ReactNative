import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Container, AreaInput, Input, List } from "./styles";
import { Feather } from "@expo/vector-icons";
import { db } from "../../firebaseConnection";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import SearchList from "../../components/SearchList";

const Search = () => {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (input === "" || input === undefined) {
      setUsers([]);
      return;
    }

    const q = query(
      collection(db, "users"),
      where("nome", ">=", input),
      where("nome", "<=", input + "\uf8ff")
    );
    const subscriber = onSnapshot(q, (querySnapshot) => {
      const listUsers = [];
      querySnapshot.forEach((doc) => {
        listUsers.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      // console.log(listUsers);
      setUsers(listUsers);
    });

    return () => subscriber();
  }, [input]);
  return (
    <Container>
      <AreaInput>
        <Feather name="search" size={20} color="#e52246" />
        <Input
          placeholder="Procurando alguem?"
          value={input}
          onChangeText={(text) => setInput(text)}
          placeholderTextColor="#353840"
        />
      </AreaInput>
      <List
        data={users}
        renderItem={({ item }) => <SearchList data={item} />}
      />
    </Container>
  );
};

export default Search;

const styles = StyleSheet.create({});
