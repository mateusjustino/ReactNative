import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function User() {
  return (
    <View style={styles.container}>
      <Text>pagina usuario</Text>
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
