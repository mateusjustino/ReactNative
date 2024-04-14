import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Button,
  Text,
  Keyboard,
  TextInput,
} from "react-native";
import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConnection";

export default function AddEditNote({ route }) {
  const data = route.params?.data;
  const [contentText, setContentText] = useState(data.contentText);
  const [title, setTitle] = useState(data.title);

  const [keyboardAberto, setKeyboardAberto] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow",
      () => setKeyboardAberto(true)
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide",
      () => setKeyboardAberto(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const editor = useEditorBridge({
    // autofocus: true,
    avoidIosKeyboard: true,
    initialContent: data.contentHTML,
    theme: {
      webview: {
        backgroundColor: "#eeee00",
      },
    },
  });

  const handleSaveContent = async () => {
    const currentContentHTML = await editor.getHTML();
    const currentContentText = await editor.getText();
    console.log(currentContentHTML);
    console.log(currentContentText);
    // setContent(currentContent);

    const contentRef = doc(db, "notes", data.id);
    await updateDoc(contentRef, {
      title: title,
      contentText: currentContentText,
      contentHTML: currentContentHTML,
    })
      .then(() => alert("salvouuuu"))
      .catch((error) => alert(error.message));

    // const washingtonRef = doc(db, "cities", "DC");
    // // Set the "capital" field of the city 'DC'
    // await updateDoc(washingtonRef, {
    //   capital: true,
    // });
  };

  return (
    <>
      <SafeAreaView style={[styles.container]}>
        <Text>Titulo:</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={(text) => setTitle(text)}
        />

        <Text>Message:</Text>
        <View style={styles.editorContainer}>
          <RichText editor={editor} />
        </View>
        <Button title="Save Conteúdo" onPress={handleSaveContent} />
      </SafeAreaView>
      <View
        style={[styles.toolbarContainer, { height: keyboardAberto ? 44 : 0 }]}
      >
        <Toolbar editor={editor} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeee00",
    padding: 10,
  },
  editorContainer: {
    flex: 1,
    // padding: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  toolbarContainer: {
    // height: 44, // Altura padrão da toolbar
    // position: "absolute",
    // bottom: 0,
    // left: 0,
    // right: 0,
  },
  input: {
    borderWidth: 1,
    padding: 10,
  },
});
