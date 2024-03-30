import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Importe os ícones do Expo

export default function App() {
  const iconNames = Object.keys(MaterialIcons.glyphMap);
  console.log(iconNames);

  return (
    <ScrollView>
      {iconNames.map((iconName, index) => (
        <View
          key={index}
          style={{ flexDirection: "row", alignItems: "center", padding: 0 }}
        >
          <MaterialIcons name={iconName} size={30} color="black" />
          <Text style={{ marginLeft: 10 }}>{iconName}</Text>
        </View>
      ))}
    </ScrollView>
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
