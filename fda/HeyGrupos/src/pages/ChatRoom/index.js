import {
  Button,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { auth, db } from "../../firebaseConnection";
import { onAuthStateChanged, signOut } from "firebase/auth";
import FabButton from "../../components/FabButton";
import { useContext, useEffect, useState } from "react";
import ModalNewRoom from "../../components/ModalNewRoom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import ChatList from "../../components/ChatList";
import { Context } from "../../context/Context";

export default function ChatRoom() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { user, setUser } = useContext(Context);

  const [modalVisible, setModalVisible] = useState(false);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateScreen, setUpdateScreen] = useState(false);

  useEffect(() => {
    const hasUser = onAuthStateChanged(auth, (userRef) => {
      if (userRef) {
        setUser(userRef);
      } else {
        setUser(null);
      }
    });
  }, [isFocused]);

  useEffect(() => {
    let isActive = true;
    async function getChats() {
      const q = query(
        collection(db, "MESSAGE_THREADS"),
        orderBy("lastMessage.createdAt", "desc"),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const threadsRef = [];
      querySnapshot.forEach((doc) => {
        threadsRef.push({
          _id: doc.id,
          name: "",
          lastMessage: { text: "" },
          ...doc.data(),
        });
      });
      if (isActive) {
        setThreads(threadsRef);
        setLoading(false);
      }
    }
    getChats();

    return () => {
      isActive = false;
    };
  }, [isFocused, updateScreen]);

  function handleSignOut() {
    signOut(auth)
      .then(() => {
        setUser(null);
        navigation.navigate("SignIn");
      })
      .catch((error) => alert(error.message));
  }

  function deleteRoom(ownerId, idRoom) {
    if (ownerId !== user?.uid) return;

    Alert.alert("Atenção!", "Você tem certeza que deseja deletar esta sala", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => handleDeleteRoom(idRoom),
      },
    ]);
  }

  async function handleDeleteRoom(idRoom) {
    await deleteDoc(doc(db, "MESSAGE_THREADS", idRoom))
      .catch((error) => alert(error.message))
      .then(() => alert("deletado"));
    setUpdateScreen(!updateScreen);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2e54d4" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRoom}>
        <View style={styles.headerRoomLeft}>
          {user && (
            <TouchableOpacity onPress={handleSignOut}>
              <MaterialIcons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
          )}

          <Text style={styles.title}>Grupos</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <MaterialIcons name="search" size={28} color="#Fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={threads}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ChatList
            data={item}
            deleteRoom={() => deleteRoom(item.owner, item._id)}
            userStatus={user}
          />
        )}
      />

      <FabButton setVisible={() => setModalVisible(true)} userStatus={user} />

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <ModalNewRoom
          setVisible={() => setModalVisible(false)}
          setUpdateScreen={() => setUpdateScreen(!updateScreen)}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerRoom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#2e54d4",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  headerRoomLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    paddingLeft: 10,
  },
});
