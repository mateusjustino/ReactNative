import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { auth, db } from "../../firebaseConnection";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import ChatMessage from "../../components/ChatMessage";
import { Feather } from "@expo/vector-icons";

export default function Messages({ route }) {
  const { thread } = route.params;
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    const hasUser = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    async function pegaOsDoc() {
      const colecaoPaiRef = collection(db, "MESSAGE_THREADS");
      const subcolecaoFilhaRef = collection(
        colecaoPaiRef,
        thread._id,
        "MESSAGES"
      );

      const q = query(subcolecaoFilhaRef, orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messagesRef = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: "",
            createdAt: serverTimestamp(),
            ...firebaseData,
          };

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.displayName,
            };
          }

          return data;
        });
        setMessages(messagesRef);
      });
      return unsubscribe;
    }
    const unsubscribe = pegaOsDoc();
    return () => unsubscribe;
  }, []);

  async function handleSend() {
    if (input === "") return;

    const colecaoPaiRef = collection(db, "MESSAGE_THREADS");
    const subcolecaoFilhaRef = collection(
      colecaoPaiRef,
      thread._id,
      "MESSAGES"
    );
    await addDoc(subcolecaoFilhaRef, {
      text: input,
      createdAt: serverTimestamp(),
      user: {
        _id: user.uid,
        displayName: user.displayName,
      },
    });

    await updateDoc(doc(db, "MESSAGE_THREADS", thread._id), {
      lastMessage: {
        text: input,
        createdAt: serverTimestamp(),
      },
    });

    setInput("");
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={{ width: "100%" }}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ChatMessage data={item} />}
        inverted={true}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ width: "100%" }}
        keyboardVerticalOffset={100}
      >
        <View style={styles.containerInput}>
          <View style={styles.mainContainerInput}>
            <TextInput
              placeholder="Sua mensage..."
              style={styles.textInput}
              value={input}
              onChangeText={(text) => setInput(text)}
              multiline={true}
              autoCorrect={false}
            />
          </View>
          <TouchableOpacity onPress={handleSend}>
            <View style={styles.buttonContainer}>
              <Feather name="send" size={22} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerInput: {
    flexDirection: "row",
    margin: 10,
    alignItems: "flex-end",
  },
  mainContainerInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    borderRadius: 25,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    maxHeight: 130,
    minHeight: 48,
  },
  buttonContainer: {
    backgroundColor: "#51c880",
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
});
