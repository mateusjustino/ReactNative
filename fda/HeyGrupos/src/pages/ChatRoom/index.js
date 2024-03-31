import { Button, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ChatRoom() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>ChatRoom</Text>
      <Button title="Login" onPress={() => navigation.navigate("SignIn")} />
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
});
