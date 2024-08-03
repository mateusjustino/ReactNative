import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { fontFamily, fontSize } from "../theme/font";
import colors from "../theme/colors";

const ButtonCustom = ({ title, background, onPressFunc, icon }) => {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: background }]}
      activeOpacity={0.8}
      onPress={onPressFunc}
    >
      {icon && icon}
      <Text style={styles.txt}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonCustom;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    paddingVertical: 4,
    // backgroundColor: colors.primaryBlue,
    borderRadius: 10,
    width: "100%",
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  txt: {
    textAlign: "center",
    color: "white",
    fontSize: fontSize.regular,
    fontFamily: fontFamily.PoppinsMedium500,
    marginTop: 3,
  },
});
