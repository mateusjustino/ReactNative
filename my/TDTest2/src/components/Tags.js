import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import colors from "../theme/colors";
import { fontFamily, fontSize } from "../theme/font";

const Tags = ({ item, activeTags, onPressFunc }) => {
  return (
    <TouchableOpacity
      style={[
        styles.tag,
        Array.isArray(activeTags) && activeTags.includes(item)
          ? { backgroundColor: colors.primaryGreen }
          : { backgroundColor: colors.primaryGreenAlfa },
      ]}
      onPress={onPressFunc ? onPressFunc : null}
      activeOpacity={onPressFunc ? 0.5 : 1}
    >
      <Text
        style={{
          fontSize: fontSize.small,
          fontFamily: fontFamily.PoppinsRegular400,
          paddingTop: 3,
        }}
      >
        #{item}
      </Text>
    </TouchableOpacity>
  );
};

export default Tags;

const styles = StyleSheet.create({
  tag: {
    // backgroundColor: colors.primaryGreenAlfa,
    padding: 3,
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderColorLight,
  },
});
