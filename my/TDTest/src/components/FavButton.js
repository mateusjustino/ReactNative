import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const FavButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.touch}
      onPress={() => navigation.navigate("AddEditNote")}
    >
      <MaterialCommunityIcons name="pencil-plus" size={24} color="black" />
    </TouchableOpacity>
  );
};

export default FavButton;

const styles = StyleSheet.create({
  touch: {
    // position: "absolute",
    // bottom: 50,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: "rgb(240,240,240)",
  },
});
