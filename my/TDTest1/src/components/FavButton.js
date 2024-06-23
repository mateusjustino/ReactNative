import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import colors from "../theme/colors";

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
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: colors.backgroundWhite,
  },
});
