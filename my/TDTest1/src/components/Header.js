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

export default function Header({ showContent }) {
  const navigation = useNavigation();
  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigation.navigate("SignIn");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      {showContent && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text>Header</Text>
          <TouchableOpacity onPress={handleLogOut}>
            <Text>LogOut</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
