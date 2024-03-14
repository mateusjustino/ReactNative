import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import React, { useState } from "react";
import { auth } from "../firebaseConnection";
import { updateEmail } from "firebase/auth";

const UpdateEmail = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleUpdateEmail = () => {
    updateEmail(auth.currentUser, email)
      .then(() => {
        alert("email atualizado");
        // para dar certo isso tive que ir no Authentication > configurações > Ações do usuarui e desativar o 'Proteção contra enumeração de e-mails (recomendado)'
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Email:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          padding: 10,
          width: "50%",
          marginBottom: 20,
        }}
        placeholder="Email..."
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <View style={{ marginBottom: 20 }}>
        <Button title="Atualizar Email" onPress={handleUpdateEmail} />
      </View>

      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default UpdateEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
