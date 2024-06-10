import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

const Tags = ({ item, activeTags, onPressFunc }) => {
  return (
    <TouchableOpacity
      style={[
        styles.tag,
        Array.isArray(activeTags) && activeTags.includes(item)
          ? { borderColor: "green" }
          : { borderColor: "red" },
      ]}
      onPress={onPressFunc}
      onLongPress={() => console.log(item)}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );
};

export default Tags;

const styles = StyleSheet.create({
  tag: {
    width: 35,
    height: 20,
    backgroundColor: "gray",
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
    marginEnd: 20,
    borderWidth: 1,
  },
});
