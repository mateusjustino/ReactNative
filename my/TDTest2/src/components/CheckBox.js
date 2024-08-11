import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { iconSize } from "../theme/icon";
import colors from "../theme/colors";

const CheckBox = () => {
  const [marked, setMarked] = useState(false);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setMarked(!marked)}
    >
      {marked && (
        <Ionicons
          name="checkmark"
          size={iconSize.regular}
          color={colors.primaryPurple}
        />
      )}
    </TouchableOpacity>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  container: {
    borderColor: colors.primaryPurple,
    borderWidth: 1,
    borderRadius: 10,
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
