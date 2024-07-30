import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { fontFamily, fontSize } from "../theme/font";
import colors from "../theme/colors";

const ButtonCustom = ({ title }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8}>
      <Text style={styles.txt}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonCustom;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: colors.primaryBlue,
    borderRadius: 10,
    width: "100%",
    marginVertical: 10,
  },
  txt: {
    textAlign: "center",
    color: "white",
    fontSize: fontSize.regular,
    fontFamily: fontFamily.PoppinsMedium500,
  },
});
