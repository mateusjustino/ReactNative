import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function User() {
  const { id } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <Text>pagina usuario id: {id}</Text>
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
