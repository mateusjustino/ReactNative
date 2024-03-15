import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import React, { useState } from "react";
import { auth } from "../firebaseConnection";
import { updatePassword } from "firebase/auth";

const UpdatePassword = ({ navigation }) => {
  const [password, setPassword] = useState("");

  const handleUpdatePassword = () => {
    updatePassword(auth.currentUser, password)
      .then(() => alert("password atualizado"))
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <Text>Password:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          padding: 10,
          width: "50%",
          marginBottom: 20,
        }}
        placeholder="Password..."
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <View style={{ marginBottom: 20 }}>
        <Button title="Atualizar Password" onPress={handleUpdatePassword} />
      </View>

      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default UpdatePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
