import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Container, AreaInput, Input, List } from "./styles";
import { Feather } from "@expo/vector-icons";

const Search = () => {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
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
    </Container>
  );
};

export default Search;

const styles = StyleSheet.create({});
