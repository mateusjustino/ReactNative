import { StyleSheet, Text, View } from "react-native";

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text>pagina configuração</Text>
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
