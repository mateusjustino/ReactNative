import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import colors from "../theme/colors";
import { iconSize } from "../theme/icon";
import ButtonCustom from "./ButtonCustom";

const FavButton = () => {
  const navigation = useNavigation();
  return (
    // <TouchableOpacity
    //   style={styles.touch}
    //   onPress={() => navigation.navigate("AddEditNote")}
    // >
    //   <Ionicons
    //     name="pencil-outline"
    //     size={iconSize.regular}
    //     color={colors.primaryPurple}
    //   />
    // </TouchableOpacity>
    <ButtonCustom
      icon={
        <Ionicons
          name="pencil-outline"
          size={iconSize.regular}
          color={colors.backgroundLight}
        />
      }
      background={colors.primaryPurple}
    />
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
