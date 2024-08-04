import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import colors from "../theme/colors";
import { iconSize } from "../theme/icon";

const FavButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.touch}
      onPress={() => navigation.navigate("AddEditNote")}
    >
      <MaterialCommunityIcons
        name="pencil-plus"
        size={iconSize.large}
        color={colors.primaryPurple}
      />
    </TouchableOpacity>
  );
};

export default FavButton;

const styles = StyleSheet.create({
  touch: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderColorLight,
    backgroundColor: colors.backgroundLight,
  },
});
