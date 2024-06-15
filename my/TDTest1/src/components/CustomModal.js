import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebaseConnection";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { UserContext } from "../context/userContext";

const CustomModal = ({
  modalVisible,
  setModalVisible,
  backgroundColorNote,
  setBackgroundColorNote,
}) => {
  const { user, setStatusBarColor, statusBarColor } = useContext(UserContext);

  useEffect(() => {
    // if (modalVisible) {
    //   if (statusBarColor === "red") {
    //     setStatusBarColor("#7f0000");
    //   } else if (statusBarColor === "green") {
    //     setStatusBarColor("#004000");
    //   } else if (statusBarColor === "blue") {
    //     setStatusBarColor("#00007f");
    //   }
    // } else {
    //   if (statusBarColor === "red") {
    //     setStatusBarColor("red");
    //   } else if (statusBarColor === "green") {
    //     setStatusBarColor("green");
    //   } else if (statusBarColor === "blue") {
    //     setStatusBarColor("blue");
    //   }
    // }
  }, [modalVisible]);

  const ColorComponent = ({ colorValue }) => {
    const changeColor = () => {
      setBackgroundColorNote(colorValue);
      setStatusBarColor(colorValue);
    };
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          backgroundColor: colorValue,
          width: 40,
          height: 40,
          borderRadius: 20,
        }}
        // onPress={() => setBackgroundColorNote(colorValue)}
        onPress={changeColor}
      />
    );
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        // Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
        setStatusBarColor(backgroundColorNote);
      }}
    >
      <TouchableOpacity
        style={{
          // backgroundColor: "rgba(0,0,0,0.5)",
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
        onPress={() => {
          setModalVisible(!modalVisible);
          setStatusBarColor(backgroundColorNote);
        }}
        activeOpacity={1}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            width: "100%",
          }}
        >
          <Text>a: {backgroundColorNote}</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <ColorComponent colorValue="red" />
            <ColorComponent colorValue="green" />
            <ColorComponent colorValue="blue" />
          </View>

          <Text>
            aparecer escrito a tag e ter a opação de editar ela, tanto o nome
            quanto se deseja excluir
          </Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  input: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    lineHeight: 20,
  },
});
