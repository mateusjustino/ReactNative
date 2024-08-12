import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { iconSize } from "../theme/icon";
import colors from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";

const CloudButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={[styles.dots, { left: -20, top: 60 }]} />
      <View
        style={[
          styles.dots,
          { left: -10, top: 50, width: 15, height: 15, borderRadius: 7.5 },
        ]}
      />
      <View style={[styles.cloud, {}]} />
      <View style={[styles.clouds, { left: -11, width: 83 }]} />
      {/* <View style={[styles.clouds, { left: -11 }]} /> */}
      {/* <View style={[styles.clouds, { top: 32 }]} /> */}
      <View style={[styles.clouds, { top: 1, height: 59 }]} />
      <Ionicons
        name="pencil-outline"
        size={iconSize.regular}
        color={colors.backgroundLight}
      />
    </TouchableOpacity>
  );
};

export default CloudButton;

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  cloud: {
    width: 70,
    height: 50,
    borderRadius: 20,
    position: "absolute",
    backgroundColor: colors.primaryPurple,
  },
  clouds: {
    width: 35,
    height: 25,
    borderRadius: 20,
    position: "absolute",
    backgroundColor: colors.primaryPurple,
  },
  dots: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: "absolute",
    backgroundColor: "red",
    backgroundColor: colors.primaryPurple,
  },
});
