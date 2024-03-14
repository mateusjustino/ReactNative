import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConnection";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import MainApp from "./MainApp";

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser({
          email: user.email,
          uid: user.uid,
        });
        setLoading(false);
        navigation.navigate("MainApp");
        return;
      }
      setLoading(false);
      setAuthUser(null);
    });
  }, []);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log(user);
        // alert("logado");
        navigation.navigate("MainApp");
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
        alert(error.message);
      });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/* <Text>aqui: {authUser?.email}</Text> */}
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

      <View style={{ marginBottom: 20 }}>
        <Button title="Login" onPress={handleLogin} />
      </View>
      <Button
        title="Go to Sign Up"
        onPress={() => navigation.navigate("SignUp")}
      />
    </View>
  );
};

export default SignIn;

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
