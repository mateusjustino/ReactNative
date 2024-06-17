import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Button,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebaseConnection";
import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { UserContext } from "../context/userContext";
import { useNavigation } from "@react-navigation/native";

const CustomModal = ({ modalVisible, setModalVisible, idNote }) => {
  const navigation = useNavigation();

  const delNote = async () => {
    // console.log("excurirrr");
    await deleteDoc(doc(db, "notes", idNote));
    navigation.goBack();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        // Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: "rgba(0,0,0,0.3)",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          setModalVisible(!modalVisible);
        }}
        activeOpacity={1}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
          }}
        >
          <Text>Deseja excluir</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 20,
            }}
          >
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text>nao</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={delNote}>
              <Text>sim</Text>
            </TouchableOpacity>
          </View>
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
