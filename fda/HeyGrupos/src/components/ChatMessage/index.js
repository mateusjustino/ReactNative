import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useMemo, useState } from "react";
import { auth } from "../../firebaseConnection";
import { Context } from "../../context/Context";

const ChatMessage = ({ data }) => {
  const { user, setUser } = useContext(Context);

  const isMyMessage = useMemo(() => {
    return data?.user?._id === user.uid;
  }, [data]);
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.messageBox,
          {
            backgroundColor: isMyMessage ? "#dcf8c5" : "#fff",
            marginLeft: isMyMessage ? 50 : 0,
            marginRight: isMyMessage ? 0 : 50,
          },
        ]}
      >
        {!isMyMessage && <Text style={styles.name}>{data?.user?.name}</Text>}

        <Text style={styles.message}>{data.text}</Text>
      </View>
    </View>
  );
};

export default ChatMessage;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  messageBox: {
    borderRadius: 5,
    padding: 10,
  },
  name: {
    color: "#f53745",
    fontWeight: "bold",
    marginBottom: 5,
  },
});
