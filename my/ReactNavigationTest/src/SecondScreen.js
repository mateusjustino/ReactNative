import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";

const SecondScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.text}>Second Screen</Text>
      <TouchableOpacity onPress={() => navigation.navigate("MaterialTab")}>
        <Text style={styles.text}>Material Tab</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("BottomTab")}>
        <Text style={styles.text}>Bottom Tab</Text>
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

export default SecondScreen;
