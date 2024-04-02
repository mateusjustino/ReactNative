import {
  Button,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { auth } from "../../firebaseConnection";
import { onAuthStateChanged, signOut } from "firebase/auth";
import FabButton from "../../components/FabButton";
import { useEffect, useState } from "react";
import ModalNewRoom from "../../components/ModalNewRoom";

export default function ChatRoom() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const hasUser = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    // console.log(hasUser);
    // setUser(hasUser);
  }, [isFocused]);

  function handleSignOut() {
    signOut(auth)
      .then(() => {
        setUser(null);
        navigation.navigate("SignIn");
      })
      .catch((error) => alert(error.message));
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

        <TouchableOpacity>
          <MaterialIcons name="search" size={28} color="#Fff" />
        </TouchableOpacity>
      </View>

      <FabButton setVisible={() => setModalVisible(true)} userStatus={user} />

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <ModalNewRoom setVisible={() => setModalVisible(false)} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRoom: {
    flexDirection: "row",
    justifyContent: "space-between",
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
