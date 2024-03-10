import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { Link, router } from "expo-router";

export default function App() {
  function handleNavigate() {
    router.replace("/dashboard");
  }
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Link href={"/profile"}>Navegar profile</Link>
      <Link href={"/user/123456"}>Navegar user</Link>

      <Button title="navegar dashboard" onPress={handleNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    alignItems: "center",
    justifyContent: "center",
  },
});
