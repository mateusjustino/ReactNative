import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import React, { useState } from "react";
import { auth } from "../firebaseConnection";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import CustomModal from "../components/CustomModal";

const UpdatePassword = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleUpdatePassword = () => {
    updatePassword(auth.currentUser, password)
      .then(() => alert("password atualizado"))
      .catch((error) => {
        // alert(error.message);
        console.log(error.code);
        //esta é a parte para reautenticar o user
        if (error.code === "auth/requires-recent-login") {
          // console.log("foi esse erro mesmo");
          setModalVisible(true);
        }
      });
  };

  const handleReauthenticate = () => {
    // console.log("aaaaaaaaaaaaa");
    // setModalVisible(false);
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      oldPassword
    );
    reauthenticateWithCredential(auth.currentUser, credential)
      .then(() => alert("usuario reautenticado"))
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

      <View style={{ marginBottom: 20 }}>
        <Button title="Modal" onPress={() => setModalVisible(true)} />
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          PropText={oldPassword}
          PropSetText={setOldPassword}
          PropFunc={handleReauthenticate}
        />
        <Text>{oldPassword}</Text>
        <Text>{oldPassword}</Text>
        <Text>{oldPassword}</Text>
        <Text>{oldPassword}</Text>
        <Text>{oldPassword}</Text>
        <Text>{oldPassword}</Text>
        <Text>{oldPassword}</Text>
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
