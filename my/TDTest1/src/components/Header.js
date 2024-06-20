import { signOut } from "firebase/auth";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { auth, db } from "../firebaseConnection";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { SimpleLineIcons } from "@expo/vector-icons";
import { deleteDoc, doc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar as StatusBarExpo } from "expo-status-bar";

export default function Header({
  fromHome,
  fromAddEditNote,
  fromSettings,
  setModalVisible,
  // idNote,
  canDelete,
}) {
  const navigation = useNavigation();
  const { user, setUser, statusBarColor } = useContext(UserContext);

  useEffect(() => {
    colorBackground();
  }, [statusBarColor]);

  const colorBackground = () => {
    if (statusBarColor === "#b20000" || statusBarColor === "rgb(250,200,200)") {
      return "rgb(250,200,200)";
    } else if (
      statusBarColor === "#005900" ||
      statusBarColor === "rgb(200,250,200)"
    ) {
      return "rgb(200,250,200)";
    } else if (
      statusBarColor === "#0000b2" ||
      statusBarColor === "rgb(200,200,250)"
    ) {
      return "rgb(200,200,250)";
    } else if (statusBarColor === "#a9a9a9" || statusBarColor === "#f2f2f2") {
      return "#f2f2f2";
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colorBackground() }]}
    >
      <StatusBarExpo
        backgroundColor={statusBarColor}
        style="dark-content"
        // animated
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 15,
        }}
      >
        {fromHome && (
          <>
            <View
              style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
            >
              <Ionicons name="logo-react" size={20} color="black" />
              <Text>Olá, {user.email}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
              <Ionicons name="menu-outline" size={20} color="black" />
            </TouchableOpacity>
          </>
        )}
        {fromAddEditNote && (
          <>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
            {canDelete && (
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Ionicons name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            )}
          </>
        )}
        {fromSettings && (
          <>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text> &#60; </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 15,
    backgroundColor: "green",
  },
});
