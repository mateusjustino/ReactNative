import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";

const AScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.text}>A Screen</Text>
      {/* <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.text}>Navegar</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    margin: 10,
    fontSize: 18,
  },
});

export default AScreen;
