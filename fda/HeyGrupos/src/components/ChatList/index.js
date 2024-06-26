import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const ChatList = ({ data, deleteRoom, userStatus }) => {
  const navigation = useNavigation();

  function openChat() {
    if (userStatus) {
      navigation.navigate("Messages", {
        thread: data,
      });
    } else {
      navigation.navigate("SignIn");
    }
  }

  return (
    <TouchableOpacity
      onPress={openChat}
      onLongPress={() => deleteRoom && deleteRoom()}
    >
      <View style={styles.row}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.nameText} numberOfLines={1}>
              {data.name}
            </Text>
          </View>
          <Text style={styles.contentText} numberOfLines={1}>
            {data.lastMessage.text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(235,234,239,0.5)",
    marginVertical: 4,
  },
  content: {
    flexShrink: 1,
  },
  header: {
    flexDirection: "row",
  },
  contentText: {
    color: "#c1c1c1",
    fontSize: 16,
    marginTop: 2,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});
