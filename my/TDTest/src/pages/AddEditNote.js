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
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import Header from "../components/Header";
import { db } from "../firebaseConnection";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import moment from "moment-timezone";
import notesOrder from "../scripts/notesOrder";
import { UserContext } from "../context/userContext";

// EAF9B2
// 674CE8
const colorGreen = "#EAF9B2";
const colorPurple = "#674CE8";

export default function AddEditNote() {
  // const { searchText, setSearchText } = useContext(UserContext);
  // console.log(searchText);

  const navigation = useNavigation();
  const route = useRoute();
  const data = route.params?.data;

  const [title, setTitle] = useState(data ? data.title : "");
  const [content, setContent] = useState(data ? data.contentText : "");
  const [activeTags, setActiveTags] = useState(data ? data.tags : []);

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
    const now = moment().format("YYYY-MM-DD HH:mm:ss");
    let orderVar = 1;
    const q = query(collection(db, "notes"), orderBy("order"));
    const querySnapshot = await getDocs(q);
    for (let i = 0; i < querySnapshot.docs.length; i++) {
      const item = querySnapshot.docs[i];
      // console.log(orderVar);
      const noteRef = doc(db, "notes", item.id);
      await updateDoc(noteRef, {
        order: orderVar,
      })
        .then(() => {
          orderVar += 1;
        })
        .catch((error) => console.log(error.message));
    }

    const contentLower = content.toLowerCase();
    await addDoc(collection(db, "notes"), {
      title: title,
      contentText: content,
      contentTextLower: contentLower,
      order: 0,
      tags: activeTags,
      // createdAt: now,
      createdAt: "2019-10-02 05:07:01",
    })
      .then(async () => {
        // ----------
        navigation.goBack();
      })
      .catch((error) => console.log(error.message));
  };

  const handleUpdate = async () => {
    const contentLower = content.toLowerCase();

    const now = moment().format("YYYY-MM-DD HH:mm:ss");

    const noteRef = doc(db, "notes", data.id);
    await updateDoc(noteRef, {
      title: title,
      contentText: content,
      contentTextLower: contentLower,
      order: 0,
      tags: activeTags,
      lastEditTime: now,
    })
      .then(async () => {
        let orderVar = 1;
        const q = query(collection(db, "notes"), orderBy("order"));
        const querySnapshot = await getDocs(q);
        for (let i = 0; i < querySnapshot.docs.length; i++) {
          const item = querySnapshot.docs[i];
          if (item.id != data.id) {
            // console.log(orderVar);
            const noteRef = doc(db, "notes", item.id);
            await updateDoc(noteRef, {
              order: orderVar,
            })
              .then(() => {
                orderVar += 1;
              })
              .catch((error) => console.log(error.message));
          }
        }
        // ----------
        navigation.goBack();
      })
      .catch((error) => console.log(error.message));
  };

  // let activeTags = ["a"];
  const activeTagsFunction = (tag) => {
    setActiveTags((prevTags) => {
      if (prevTags.includes(tag)) {
        // Se a tag já existe, remove-a
        return prevTags.filter((t) => t !== tag).sort();
      } else {
        // Se a tag não existe, adiciona-a
        return [...prevTags, tag].sort();
      }
    });
    // console.log(activeTags);
  };

  const tagsData = ["a", "b", "c"];
  return (
    <>
      <Header showContent />
      <View style={styles.fullScreen}>
        {data ? (
          <Button title="save" onPress={handleUpdate} />
        ) : (
          <Button title="add" onPress={handleAdd} />
        )}
        <View
          style={{
            margin: 10,
            flexDirection: "row",
            // backgroundColor: "green",
            width: "100%",
            padding: 10,
          }}
        >
          <FlatList
            data={tagsData}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={[
                    styles.tag,
                    Array.isArray(activeTags) && activeTags.includes(item)
                      ? { borderColor: "green" }
                      : { borderColor: "red" },
                  ]}
                  onPress={() => activeTagsFunction(item)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              );
            }}
            horizontal
          />
        </View>
        <Text>{activeTags}</Text>
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
