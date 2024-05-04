import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  Text,
  View,
  ActivityIndicator,
  Button,
  Alert,
  TextInput,
} from "react-native";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import Header from "../components/Header";
import { db } from "../firebaseConnection";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import moment from "moment-timezone";
import { UserContext } from "../context/userContext";

// EAF9B2
// 674CE8
const colorGreen = "#EAF9B2";
const colorPurple = "#674CE8";

export default function AddEditNote() {
  const navigation = useNavigation();
  const route = useRoute();
  const data = route.params?.data;
  const { timezone } = useContext(UserContext);

  const [title, setTitle] = useState(data ? data.title : "");
  const [content, setContent] = useState(data ? data.contentText : "");

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = navigation.addListener("beforeRemove", () => {
        // Aqui você pode executar a lógica quando o usuário está tentando voltar
        // por exemplo, exibir um alerta, mostrar um modal de confirmação, etc.
        // Se você retornar false aqui, a ação de voltar será cancelada.
        console.log("retornou");
        // Retorne true para permitir que a tela seja removida

        return true;
      });

      return unsubscribe;
    }, [navigation])
  );

  useEffect(() => {
    // setIsLoading(true);
    // setIsLoading(false);
  }, []);

  const handleAdd = async () => {
    const currentDateTime = moment();
    await addDoc(collection(db, "notes"), {
      title: title,
      contentText: content,
      createdAt: currentDateTime,
    })
      .then(() => navigation.goBack())
      .catch((error) => console.log(error.message));
  };

  const handleUpdate = async () => {
    const currentDateTime = moment();

    const noteRef = doc(db, "notes", data.id);
    await updateDoc(noteRef, {
      title: title,
      contentText: content,
      lastEditTime: currentDateTime,
    })
      .then(() => navigation.goBack())
      .catch((error) => console.log(error.message));
  };
  return (
    <>
      <Header showContent />
      <View style={styles.fullScreen}>
        {data ? (
          <Button title="save" onPress={handleUpdate} />
        ) : (
          <Button title="add" onPress={handleAdd} />
        )}
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Content"
          value={content}
          onChangeText={(text) => setContent(text)}
          textAlignVertical="top"
          multiline
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    padding: 10,
  },
  input: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    lineHeight: 20,
  },
});
