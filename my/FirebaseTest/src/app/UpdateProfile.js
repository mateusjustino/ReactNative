import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import React, { useState } from "react";
import { auth } from "../firebaseConnection";
import { updateProfile } from "firebase/auth";

const UpdateProfile = ({ navigation }) => {
  const [nome, setNome] = useState("");

  console.log("aaa", auth.currentUser.uid);
  const handleUpdateProfile = () => {
    updateProfile(auth.currentUser, {
      displayName: nome,
      appName: "Myy Firebase Test",
    })
      .then(() => {
        alert("nome atualizado");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Nome:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          padding: 10,
          width: "50%",
          marginBottom: 20,
        }}
        placeholder="Nome..."
        value={nome}
        onChangeText={(text) => setNome(text)}
      />

      <View style={{ marginBottom: 20 }}>
        <Button title="Atualizar Nome" onPress={handleUpdateProfile} />
      </View>

      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
