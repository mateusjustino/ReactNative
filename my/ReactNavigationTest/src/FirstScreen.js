import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated from "react-native-reanimated";
const FirstScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.text}>First Screen</Text>
      <TouchableOpacity onPress={() => navigation.navigate("SecondScreen")}>
        <Text style={styles.text}>Navegar</Text>
      </TouchableOpacity>
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

export default FirstScreen;
