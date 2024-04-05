import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { db, auth } from "../../firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

const ModalNewRoom = ({ setVisible, setUpdateScreen }) => {
  const [roomName, setRoomName] = useState("");

  let user;
  onAuthStateChanged(auth, (userData) => {
    if (userData) {
      user = userData;
    }
  });

  async function handleButtonCreate() {
    if (roomName === "") return;

    const querySnapshot = await getDocs(collection(db, "MESSAGE_THREADS"));
    let myThreads = 0;
    querySnapshot.docs.map((docItem) => {
      if (docItem.data().owner === user.uid) {
        myThreads += 1;
      }
    });
    if (myThreads >= 4) {
      alert("Já atingiu o limite de usuarios");
    } else {
      createRoom();
    }
  }

  async function createRoom() {
    const paiRef = await addDoc(collection(db, "MESSAGE_THREADS"), {
      name: roomName,
      owner: user.uid,
      lastMessage: {
        text: `Grupo ${roomName} criado. Bem vindo(a)!`,
        createdAt: serverTimestamp(),
      },
    });
    const paiId = paiRef.id;
    const subColecaoRef = collection(
      doc(db, "MESSAGE_THREADS", paiId),
      "MESSAGES"
    );
    await addDoc(subColecaoRef, {
      text: `Grupo ${roomName} criado. Bem vindo(a)!`,
      createdAt: serverTimestamp(),
      system: true,
    }).then(() => {
      setVisible();
      setUpdateScreen();
    });
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={setVisible}>
        <View style={styles.modal}></View>
      </TouchableWithoutFeedback>

      <View style={styles.modalContent}>
        <Text style={styles.title}>Criar um novo Grupo?</Text>
        <TextInput
          style={styles.input}
          value={roomName}
          onChangeText={(text) => setRoomName(text)}
          placeholder="Nome para sua sala?"
        />

        <TouchableOpacity
          style={styles.buttonCreate}
          onPress={handleButtonCreate}
        >
          <Text style={styles.buttonText}>Criar sala</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setVisible(false)}
        >
          <Text>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ModalNewRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(34,34,34,0.4)",
  },
  modal: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  title: {
    marginTop: 14,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 19,
  },
  input: {
    borderRadius: 4,
    height: 45,
    backgroundColor: "#ddd",
    marginVertical: 15,
    fontSize: 16,
    paddingHorizontal: 5,
  },
  buttonCreate: {
    borderRadius: 4,
    backgroundColor: "#2e54d4",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#fff",
  },
  backButton: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
