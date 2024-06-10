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
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { SimpleLineIcons } from "@expo/vector-icons";

export default function Header({ showContent, note, setModalVisible }) {
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);

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

  return (
    <SafeAreaView style={styles.container}>
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
              <Text>uid: {user.uid}</Text>
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
    marginHorizontal: 10,
    marginTop: 10,
  },
});
