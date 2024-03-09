import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { db } from "./firebaseConnection";
import { deleteDoc, doc } from "firebase/firestore";

const UsersList = ({ data, handleEdit }) => {
  async function handleDeleteItem() {
    const docRef = doc(db, "users", data.id);
    await deleteDoc(docRef);
  }

  function handleEditUser() {
    handleEdit(data);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.item}>Nome: {data.nome}</Text>
      <Text style={styles.item}>Idade: {data.idade}</Text>
      <Text style={styles.item}>Cargo: {data.cargo}</Text>
      <TouchableOpacity style={styles.button} onPress={handleDeleteItem}>
        <Text style={styles.buttonText}>Deletar usuario</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonEdit} onPress={handleEditUser}>
        <Text style={styles.buttonText}>Editar usuario</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UsersList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginBottom: 14,
  },
  item: {
    color: "#000",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#b3261e",
    alignSelf: "flex-start",
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    paddingLeft: 14,
    paddingRight: 14,
  },
  buttonEdit: {
    backgroundColor: "#000",
    alignSelf: "flex-start",
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});
