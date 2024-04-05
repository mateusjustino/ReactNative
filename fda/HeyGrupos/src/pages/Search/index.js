import { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { auth, db } from "../../firebaseConnection";
import { Context } from "../../context/Context";
import { useIsFocused } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import ChatList from "../../components/ChatList";

export default function Search() {
  const [input, setInput] = useState("");
  const [chats, setChats] = useState([]);
  const { user } = useContext(Context);
  const isFocused = useIsFocused();

  useEffect(() => {}, [isFocused]);

  async function handleSearch() {
    if (input === "") return;

    const q = query(
      collection(db, "MESSAGE_THREADS"),
      where("name", ">=", input),
      where("name", "<=", input + "\uf8ff")
    );
    const querySnapshot = await getDocs(q);
    const threads = querySnapshot.docs.map((docSnap) => {
      return {
        _id: docSnap.id,
        name: "",
        lastMessage: {
          text: "",
        },
        ...docSnap.data(),
      };
    });
    setChats(threads);
    setInput("");
    Keyboard.dismiss();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerInput}>
        <TextInput
          placeholder="Digite o nome da sala"
          value={input}
          onChangeText={(text) => setInput(text)}
          style={styles.input}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.buttonSearch} onPress={handleSearch}>
          <MaterialIcons name="search" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={chats}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ChatList data={item} userStatus={user} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerInput: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginVertical: 14,
  },
  input: {
    backgroundColor: "#ebebeb",
    marginLeft: 10,
    height: 50,
    width: "80%",
    borderRadius: 4,
    padding: 5,
  },
  buttonSearch: {
    backgroundColor: "#2e54d4",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "15%",
    marginLeft: 5,
    marginRight: 10,
  },
});
