import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Button,
  Text,
  Keyboard,
} from "react-native";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConnection";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function AddEditNote() {
  const navigation = useNavigation();
  const route = useRoute();
  const data = route.params?.data;
  const isAdd = data ? false : true;

  const [contentText, setContentText] = useState(isAdd ? "" : data.contentText);
  const [title, setTitle] = useState(isAdd ? "" : data.title);

  const handleUpdateContent = async () => {
    const contentRef = doc(db, "notes", data.id);
    await updateDoc(contentRef, {
      title: title,
      contentText: contentText,
    })
      .then(() => navigation.goBack())
      .catch((error) => alert(error.message));
  };

  const handleAddContent = async () => {
    await addDoc(collection(db, "notes"), {
      title: title,
      contentText: contentText,
    })
      .then(() => navigation.goBack())
      .catch((error) => alert(error.message));
  };

  return (
    <SafeAreaView style={styles.fullScreen}>
      <TextInput
        style={styles.input}
        placeholder="title"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <TextInput
        style={[styles.input, { flex: 1 }]}
        placeholder="title"
        value={contentText}
        onChangeText={(text) => setContentText(text)}
        multiline
        textAlignVertical="top"
      />

      <Button
        title={isAdd ? "Add" : "Update"}
        onPress={isAdd ? handleAddContent : handleUpdateContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    padding: 10,
  },
  input: {
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
});
