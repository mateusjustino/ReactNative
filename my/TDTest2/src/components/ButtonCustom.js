import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { fontFamily, fontSize } from "../theme/font";
import colors from "../theme/colors";
import Loading from "./Loading";

const ButtonCustom = ({
  title,
  background,
  onPressFunc,
  icon,
  active,
  heightBtn,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: background, height: heightBtn ? heightBtn : 40 },
      ]}
      activeOpacity={0.8}
      onPress={onPressFunc}
    >
      {active ? (
        <View style={{ justifyContent: "center" }}>
          <Loading />
        </View>
      ) : (
        <>
          {icon && icon}
          {title && <Text style={styles.txt}>{title}</Text>}
        </>
      )}
    </TouchableOpacity>
  );
};

export default ButtonCustom;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    paddingVertical: 4,
    // backgroundColor: colors.primaryPurple,
    borderRadius: 10,
    width: "100%",
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    // height: 40,
  },
  txt: {
    textAlign: "center",
    color: "white",
    fontSize: fontSize.regular,
    fontFamily: fontFamily.PoppinsMedium500,
    marginTop: 3,
  },
});
