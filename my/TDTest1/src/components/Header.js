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
import { auth } from "../firebaseConnection";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { SimpleLineIcons } from "@expo/vector-icons";

export default function Header({ showContent, note, setModalVisible }) {
  const navigation = useNavigation();
  const { user, setUser, statusBarColor } = useContext(UserContext);

  useEffect(() => {
    colorBackground();
  }, [statusBarColor]);

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate("SignIn");
        setUser({});
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleOptions = () => {
    // console.log("saddsasda");
    setModalVisible(true);
  };

  const colorBackground = () => {
    if (statusBarColor === "#7f0000" || statusBarColor === "red") {
      return "red";
    } else if (statusBarColor === "#004000" || statusBarColor === "green") {
      return "green";
    } else if (statusBarColor === "#00007f" || statusBarColor === "blue") {
      return "blue";
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colorBackground() }]}
    >
      <StatusBar
        // animated={true}
        backgroundColor={statusBarColor}
        // backgroundColor="#7f0000"
        barStyle="dark-content"
      />
      {showContent && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {note ? (
            <>
              <Text>note</Text>
              <TouchableOpacity onPress={handleOptions}>
                <SimpleLineIcons
                  name="options-vertical"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                <Text>menu</Text>
              </TouchableOpacity>
              <Text>{user.email}</Text>
              <TouchableOpacity onPress={handleLogOut}>
                <Text>LogOut</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
});
