import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebaseConnection";
import { signInWithEmailAndPassword } from "firebase/auth";
import { UserContext } from "../context/userContext";

const SignIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("@email.com");
  const [password, setPassword] = useState("123123");
  const { user, setUser, EnterUser } = useContext(UserContext);

  const handleLogin = () => {
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // const user = userCredential.user;
          // console.log(userCredential.user);

          // setUser(userCredential.user);
          EnterUser(userCredential.user);

          navigation.navigate("Home");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
          console.log(errorCode);
          console.log(errorMessage);
          console.log(error);
        });
    }
  };
  return (
    <View style={styles.container}>
      <Text>Tela de SignIn</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text>Logar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text>Tela de Registro</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  btn: {
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "lightblue",
  },
});
