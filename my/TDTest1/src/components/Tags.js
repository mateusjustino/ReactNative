import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

const Tags = ({ item, activeTags, onPressFunc }) => {
  return (
    <TouchableOpacity
      style={[
        styles.tag,
        Array.isArray(activeTags) && activeTags.includes(item)
          ? { borderColor: "green" }
          : { borderColor: "rgba(0,0,0,0.1)" },
      ]}
      onPress={onPressFunc}
    >
      <Text>#{item}</Text>
    </TouchableOpacity>
  );
};

export default Tags;

const styles = StyleSheet.create({
  tag: {
    backgroundColor: "rgb(220,220,220)",
    marginVertical: 10,
    padding: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
});
