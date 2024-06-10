import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebaseConnection";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { UserContext } from "../context/userContext";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const SignUp = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser, EnterUser } = useContext(UserContext);

  const handleRegister = () => {
    if (email && password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed up
          // const user = userCredential.user;
          // console.log(user);
          EnterUser(userCredential.user);

          // provavel que nao precise criar um doc vazio no banco aqui
          // await setDoc(doc(db, "settings", userCredential.user.uid), {});

          signInWithEmailAndPassword(auth, email, password)
            .then(() => {
              navigation.navigate("Home");
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              alert(errorMessage);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text>Tela de SignUp</Text>

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

      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text>Registrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text>Tela de Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUp;

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
    lineHeight: 20,
  },
  btn: {
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "lightblue",
  },
});
