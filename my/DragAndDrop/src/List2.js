import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const MyComponent = () => {
  const [column1, setColumn1] = useState([
    { id: "1", content: "Item 1" },
    { id: "2", content: "Item 2" },
    { id: "3", content: "Item 3" },
  ]);

  const [column2, setColumn2] = useState([
    { id: "4", content: "Item 4" },
    { id: "5", content: "Item 5" },
  ]);

  const renderColumn1Item = (item) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.item}
        onPress={() => console.log("Pressed:", item.content)}
      >
        <Text>{item.content}</Text>
      </TouchableOpacity>
    );
  };

  const renderColumn2Item = (item) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.item}
        onPress={() => console.log("Pressed:", item.content)}
      >
        <Text>{item.content}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.column}>
        {column1.map((item) => renderColumn1Item(item))}
      </ScrollView>
      <ScrollView style={styles.column}>
        {column2.map((item) => renderColumn2Item(item))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  column: {
    flex: 1,
    margin: 5,
  },
  item: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
    margin: 5,
    borderWidth: 1,
    borderColor: "grey",
  },
});

export default MyComponent;
