import { StyleSheet, View, Button } from "react-native";
import React, { useState } from "react";
import { auth } from "../firebaseConnection";
import { sendPasswordResetEmail } from "firebase/auth";

const PasswordReset = ({ navigation }) => {
  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, auth.currentUser.email)
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
        <Button
          title="Send Reset Password Email"
          onPress={handlePasswordReset}
        />
      </View>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default PasswordReset;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
