import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { useEffect, useState } from "react";
import FormUsers from "./src/FormUsers";
import { auth } from "./src/firebaseConnection";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export default function App() {
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
        return;
      }

      setAuthUser(null);
      setLoading(false);
    });
  }, []);

  async function handleCreateUser() {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    console.log(user);
  }

  function handleLogin() {
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        // console.log(user);
        setAuthUser({
          email: user.user.email,
          uid: user.user.uid,
        });
      })
      .catch((erro) => {
        console.log(erro);
      });
  }

  async function handleLogout() {
    await signOut(auth);
    setAuthUser(null);
  }

  if (authUser) {
    return (
      <View style={styles.container}>
        <FormUsers />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {loading && <Text>loading...</Text>}

      <Text style={styles.label}>Email: </Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu Email..."
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <Text style={styles.label}>Senha: </Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu Senha..."
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleCreateUser}>
        <Text style={styles.buttonText}>Criar uma conta</Text>
      </TouchableOpacity>
      {authUser && (
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Sair da conta</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    padding: 5,
    paddingHorizontal: 15,
    marginBottom: 14,
    borderRadius: 5,
    width: "70%",
  },
  button: {
    backgroundColor: "#000",
    padding: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: "#fff",
  },
});
