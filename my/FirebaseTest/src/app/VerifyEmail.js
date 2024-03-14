import { StyleSheet, View, Button } from "react-native";
import React from "react";
import { auth } from "../firebaseConnection";
import { sendEmailVerification } from "firebase/auth";

const VerifyEmail = ({ navigation }) => {
  const handleVerifyEmail = () => {
    // auth.useDeviceLanguage() // para utilizar o idioma do navegador
    sendEmailVerification(auth.currentUser)
      .then(() => {
        alert("email enviado");
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 20 }}>
        <Button title="Send Verify Email" onPress={handleVerifyEmail} />
      </View>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default VerifyEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
