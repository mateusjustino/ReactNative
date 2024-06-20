import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
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
import { UserContext } from "../context/userContext";
import Tags from "../components/Tags";
import CustomModal from "../components/CustomModal";
import { Ionicons } from "@expo/vector-icons";

const colorGreen = "#EAF9B2";
const colorPurple = "#674CE8";

export default function AddEditNote() {
  const navigation = useNavigation();
  const route = useRoute();
  const data = route.params?.data;

  const { user, tags, setStatusBarColor, statusBarColor } =
    useContext(UserContext);
  const [title, setTitle] = useState(data ? data.title : "");
  const [content, setContent] = useState(data ? data.contentText : "");
  const [activeTags, setActiveTags] = useState(data ? data.tags : []);
  const [modalVisible, setModalVisible] = useState(false);
  const [backgroundColorNote, setBackgroundColorNote] = useState(
    data ? data.backgroundColor : "#f2f2f2"
  );
  const [showOptions, setShowOptions] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = navigation.addListener("beforeRemove", () => {
        // aqui consigo executar algo quando volto para a tela anterior
        setStatusBarColor("#f2f2f2");
        setBackgroundColorNote("#f2f2f2");
        // if (data) {
        //   handleUpdate();
        // }
        return true;
      });

      return unsubscribe;
    }, [navigation])
  );

  useEffect(() => {
    if (data) {
      setStatusBarColor(data.backgroundColor);
    }
    if (modalVisible) {
      if (statusBarColor === "red") {
        setStatusBarColor("#b20000");
      } else if (statusBarColor === "green") {
        setStatusBarColor("#005900");
      } else if (statusBarColor === "blue") {
        setStatusBarColor("#0000b2");
      } else if (statusBarColor === "#f2f2f2") {
        setStatusBarColor("#a9a9a9");
      }
    } else {
      if (statusBarColor === "#b20000") {
        setStatusBarColor("red");
      } else if (statusBarColor === "#005900") {
        setStatusBarColor("green");
      } else if (statusBarColor === "#0000b2") {
        setStatusBarColor("blue");
      } else if (statusBarColor === "#a9a9a9") {
        setStatusBarColor("#f2f2f2");
      }
    }
  }, [modalVisible]);

  // useEffect(() => {}, [modalVisible]);

  const handleAdd = async () => {
    const now = moment().format("YYYY-MM-DD HH:mm:ss");
    let orderVar = 1;

    const q = query(collection(db, "notes"), orderBy("order"));
    const querySnapshot = await getDocs(q);
    // primeiro vou aumentar a order de todos os itens
    for (let i = 0; i < querySnapshot.docs.length; i++) {
      const item = querySnapshot.docs[i];
      const noteRef = doc(db, "notes", item.id);
      await updateDoc(noteRef, {
        order: orderVar,
      })
        .then(() => {
          orderVar += 1;
        })
        .catch((error) => console.log(error.message));
    }

    // depois apenos adiciono um novo com order em 0
    const contentLower = content.toLowerCase();
    await addDoc(collection(db, "notes"), {
      title: title,
      contentText: content,
      contentTextLower: contentLower,
      order: 0,
      tags: activeTags,
      createdAt: now,
      uid: user.uid,
      backgroundColor: statusBarColor,
    })
      .then(async () => {
        navigation.goBack();
      })
      .catch((error) => console.log(error.message));
  };

  const handleUpdate = async () => {
    const contentLower = content.toLowerCase();

    const now = moment().format("YYYY-MM-DD HH:mm:ss");

    // primeiro vou atualizar a nota atual com as novas infos e order em 0
    const noteRef = doc(db, "notes", data.id);
    await updateDoc(noteRef, {
      title: title,
      contentText: content,
      contentTextLower: contentLower,
      order: 0,
      tags: activeTags,
      lastEditTime: now,
      backgroundColor: statusBarColor,
    })
      .then(async () => {
        let orderVar = 1;
        const q = query(collection(db, "notes"), orderBy("order"));
        const querySnapshot = await getDocs(q);
        for (let i = 0; i < querySnapshot.docs.length; i++) {
          const item = querySnapshot.docs[i];
          if (item.id != data.id) {
            // aqui vou atualizar todos as notas aumentar a order delas em 1, menos a que foi atualizada anteriormente
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
        navigation.goBack();
      })
      .catch((error) => console.log(error.message));
  };

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
  };

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
          width: 30,
          height: 30,
          borderRadius: 30,
          borderColor: "rgba(0,0,0,0.1)",
          borderWidth: 1,
        }}
        // onPress={() => setBackgroundColorNote(colorValue)}
        onPress={changeColor}
      />
    );
  };

  return (
    <>
      <Header
        setModalVisible={setModalVisible}
        // modalVisible={modalVisible}
        fromAddEditNote
        // idNote={data ? data.id : null}
        canDelete={data ? true : false}
      />
      <View
        style={[
          styles.fullScreen,
          {
            backgroundColor: backgroundColorNote
              ? backgroundColorNote
              : "#f2f2f2",
          },
        ]}
      >
        <TextInput
          style={[styles.input, { fontWeight: "bold" }]}
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

        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginBottom: 10,
            justifyContent: "space-between",
            height: 30,
            alignItems: "center",
          }}
        >
          {!showOptions && (
            <>
              <TouchableOpacity onPress={() => setShowOptions("tags")}>
                <Ionicons name="pricetags-outline" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowOptions("colors")}>
                <Ionicons
                  name="color-palette-outline"
                  size={20}
                  color="black"
                />
              </TouchableOpacity>
            </>
          )}
          {showOptions === "tags" && (
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
                // backgroundColor: "red",
              }}
            >
              <TouchableOpacity onPress={() => setShowOptions(null)}>
                <Ionicons name="close" size={20} color="black" />
              </TouchableOpacity>
              <FlatList
                data={tags}
                renderItem={({ item }) => {
                  return (
                    <Tags
                      item={item}
                      activeTags={activeTags}
                      onPressFunc={() => activeTagsFunction(item)}
                    />
                  );
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginRight: 20 }}
              />
            </View>
          )}
          {showOptions === "colors" && (
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <View style={{ flexDirection: "row", gap: 10 }}>
                <ColorComponent colorValue="#f2f2f2" />
                <ColorComponent colorValue="rgb(250,200,200)" />
                <ColorComponent colorValue="rgb(200,250,200)" />
                <ColorComponent colorValue="rgb(200,200,250)" />
              </View>
              <TouchableOpacity onPress={() => setShowOptions(null)}>
                <Ionicons name="close" size={20} color="black" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={data ? handleUpdate : handleAdd}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{data ? "Update" : "Add"}</Text>
        </TouchableOpacity>
        {/* {data ? (
          <Button title="save" onPress={handleUpdate} />
        ) : (
          <Button title="add" onPress={handleAdd} />
        )} */}

        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          idNote={data ? data.id : null}
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
    borderColor: "rgba(0,0,0,0.1)",
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
  button: {
    backgroundColor: "lightgreen",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderColor: "rgba(0,0,0,0.1)",
  },
  buttonText: {
    fontWeight: "bold",
  },
});
