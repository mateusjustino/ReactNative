import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConnection";

const SignUp = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredencial) => {
        // const cratedUser = userCredencial.user;
        // console.log(cratedUser);
        updateProfile(auth.currentUser, {
          displayName: name,
        })
          .then(() => {
            console.log("nome inserido");
          })
          .catch((error) => {
            alert(error.message);
          });
        alert("criado com sucesso");
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Name..."
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Email..."
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <Text>Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Password..."
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    width: "50%",
    marginBottom: 20,
  },
});
