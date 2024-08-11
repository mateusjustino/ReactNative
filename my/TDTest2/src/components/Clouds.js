import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import colors from "../theme/colors";

const { width, height } = Dimensions.get("window");
const cloudHeight = height * 0.1; // 5% da altura da tela

export default function CloudShape({ top }) {
  return (
    <View style={[styles.cloud, { top: top ? top : -5 }]}>
      <View style={[styles.circle, styles.circleStart]} />
      <View style={[styles.circle, styles.circleLeft]} />
      <View style={[styles.circle, styles.circleLeftCenter]} />
      <View style={[styles.circle, styles.circleCenterLeft]} />
      <View style={[styles.circle, styles.circleCenter]} />
      <View style={[styles.circle, styles.circleCenterRight]} />
      <View style={[styles.circle, styles.circleRightCenter]} />
      <View style={[styles.circle, styles.circleRight]} />
      <View style={[styles.circle, styles.circleEnd]} />
    </View>
  );
}

const styles = StyleSheet.create({
  cloud: {
    position: "relative",
    // width: "100%",
    height: cloudHeight * 0.1, // 5% da altura da tela
    justifyContent: "space-between",
    flexDirection: "row",
  },
  circle: {
    backgroundColor: colors.primaryPurple,
    position: "absolute",
  },

  circleCenter: {
    height: cloudHeight,
    width: cloudHeight,
    borderRadius: cloudHeight * 0.5,
    right: "40%",
    left: "40%",
    top: -5,
  },
  circleCenterLeft: {
    height: cloudHeight,
    width: cloudHeight,
    borderRadius: cloudHeight * 0.5,
    right: "30%",
    top: -3,
  },
  circleCenterRight: {
    height: cloudHeight,
    width: cloudHeight,
    borderRadius: cloudHeight * 0.5,
    left: "30%",
    top: -3,
  },
  circleLeftCenter: {
    height: cloudHeight,
    width: cloudHeight,
    borderRadius: cloudHeight * 0.5,
    right: "17%",
    top: -1,
  },
  circleRightCenter: {
    height: cloudHeight,
    width: cloudHeight,
    borderRadius: cloudHeight * 0.5,
    left: "17%",
    top: -1,
  },
  circleLeft: {
    height: cloudHeight,
    width: cloudHeight,
    borderRadius: cloudHeight * 0.5,
    right: "4%",
    top: 1,
  },
  circleRight: {
    height: cloudHeight,
    width: cloudHeight,
    borderRadius: cloudHeight * 0.5,
    left: "4%",
    top: 1,
  },
  circleStart: {
    height: cloudHeight,
    width: cloudHeight,
    borderRadius: cloudHeight * 0.5,
    right: "-8%",
    top: 3,
  },
  circleEnd: {
    height: cloudHeight,
    width: cloudHeight,
    borderRadius: cloudHeight * 0.5,
    left: "-8%",
    top: 3,
  },
});
