import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text>pagina painel</Text>
      <Link href={"/"}>navegar home</Link>
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
