import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { db, auth } from "./firebaseConnection";
import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import UsersList from "./users";
import { signOut } from "firebase/auth";

export default function FormUsers() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [cargo, setCargo] = useState("");

  const [users, setUsers] = useState([]);

  const [showForm, setShowForm] = useState(true);
  const [isEditing, setIsEditing] = useState("");

  useEffect(() => {
    async function getDados() {
      const usersRef = collection(db, "users");
      onSnapshot(usersRef, (snapshot) => {
        let lista = [];
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            nome: doc.data().nome,
            idade: doc.data().idade,
            cargo: doc.data().cargo,
          });
        });
        setUsers(lista);
      });
      // await getDocs(usersRef)
      //   .then((snapshot) => {
      //     let lista = [];
      //     snapshot.forEach((doc) => {
      //       lista.push({
      //         id: doc.id,
      //         nome: doc.data().nome,
      //         idade: doc.data().idade,
      //         cargo: doc.data().cargo,
      //       });
      //     });
      //     setUsers(lista);
      //   })
      //   .catch((erro) => {
      //     console.log(erro);
      //   });
    }
    getDados();
  }, []);

  async function handleRegister() {
    await addDoc(collection(db, "users"), {
      nome: nome,
      idade: idade,
      cargo: cargo,
    })
      .then(() => {
        console.log("deu certo");
        setNome("");
        setIdade("");
        setCargo("");
      })
      .catch((erro) => {
        console.log(erro);
      });
  }

  function handleToggle() {
    setShowForm(!showForm);
  }

  function editUser(data) {
    setNome(data.nome);
    setIdade(data.idade);
    setCargo(data.cargo);
    setIsEditing(data.id);
  }

  async function handleEditUser() {
    const docRef = doc(db, "users", isEditing);
    await updateDoc(docRef, {
      nome: nome,
      idade: idade,
      cargo: cargo,
    });
    setNome("");
    setIdade("");
    setCargo("");
    setIsEditing("");
  }

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <View style={styles.container}>
      {showForm && (
        <>
          <Text style={styles.label}>Nome:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu Nome..."
            value={nome}
            onChangeText={(text) => setNome(text)}
          />

          <Text style={styles.label}>Idade:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu Idade..."
            value={idade}
            onChangeText={(text) => setIdade(text)}
          />

          <Text style={styles.label}>Cargo:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu Cargo..."
            value={cargo}
            onChangeText={(text) => setCargo(text)}
          />

          {isEditing !== "" ? (
            <TouchableOpacity style={styles.button} onPress={handleEditUser}>
              <Text style={styles.buttonText}>Editar Usuário</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Adicionar</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      <TouchableOpacity onPress={handleToggle} style={styles.button}>
        <Text style={styles.buttonText}>
          {showForm ? "Esconder Formulário" : "Mostrar Formulário"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Usuários:</Text>
      <FlatList
        style={styles.list}
        data={users}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <UsersList data={item} handleEdit={(item) => editUser(item)} />
        )}
      />

      <TouchableOpacity onPress={handleLogout} style={styles.button}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: "#000",
    margin: 10,
    borderRadius: 5,
    padding: 5,
  },
  buttonText: {
    padding: 8,
    color: "#fff",
  },
  label: {
    color: "#000",
    fontSize: 18,
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    marginLeft: 8,
    marginRight: 8,
    padding: 10,
    borderRadius: 5,
    width: "70%",
  },
  list: {
    marginTop: 8,
  },
});
