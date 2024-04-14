import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const NoteList = ({ data }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        margin: 10,
        borderRadius: 10,
      }}
      onPress={() =>
        navigation.navigate("AddEditNote", {
          data: data,
        })
      }
    >
      <View style={{ margin: 10 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{data.title}</Text>
      </View>

      <View style={{ margin: 10, maxHeight: 100, overflow: "scroll" }}>
        <Text>{data.contentText}</Text>
      </View>

      <View style={{ alignItems: "flex-end", margin: 10 }}>
        {data.lastEditTime ? (
          <Text style={{ fontSize: 12 }}>
            Last time edited:
            <Text style={{ fontStyle: "italic" }}> {data.lastEditTime}</Text>
          </Text>
        ) : (
          <Text style={{ fontSize: 12 }}>
            Created at:
            <Text style={{ fontStyle: "italic" }}> {data.createdAt}</Text>
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default NoteList;

const styles = StyleSheet.create({});
