import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
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
  where,
} from "firebase/firestore";
import moment from "moment";
import { UserContext } from "../context/userContext";
import Tags from "../components/Tags";
import CustomModal from "../components/CustomModal";
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors";
import { fontFamily, fontSize } from "../theme/font";
import { iconSize } from "../theme/icon";
import Loading from "../components/Loading";
import { configureNavigationBar } from "../scripts/NavigationBar";
import ButtonCustom from "../components/ButtonCustom";

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
    data ? data.backgroundColor : colors.backgroundLight
  );
  const [showOptions, setShowOptions] = useState(null);
  const [activeLoading, setActiveLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = navigation.addListener("beforeRemove", () => {
        // aqui consigo executar algo quando volto para a tela anterior
        setStatusBarColor(colors.backgroundLight);
        setBackgroundColorNote(colors.backgroundLight);
        return true;
      });

      return unsubscribe;
    }, [navigation])
  );

  // useEffect(() => {
  //   if (data) {
  //     // if (!modalVisible) {
  //     //   setStatusBarColor(data.backgroundColor);
  //     // }
  //     // configureNavigationBar(data.backgroundColor);
  //   }
  // }, [modalVisible]);
  useEffect(() => {
    if (data) {
      setStatusBarColor(data.backgroundColor);
      configureNavigationBar(data.backgroundColor);
    } else {
      setStatusBarColor(colors.backgroundLight);
      configureNavigationBar(colors.backgroundLight);
    }
  }, []);

  const handleAdd = async () => {
    setActiveLoading(true);
    const now = moment().format("YYYY-MM-DD HH:mm:ss");
    let orderVar = 1;

    const q = query(
      collection(db, "notes"),
      orderBy("order"),
      where("uid", "==", user.uid)
    );
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

    setActiveLoading(false);
  };

  const handleUpdate = async () => {
    setActiveLoading(true);
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
        const q = query(
          collection(db, "notes"),
          orderBy("order"),
          where("uid", "==", user.uid)
        );
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

    setActiveLoading(false);
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
      configureNavigationBar(colorValue);
    };
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          backgroundColor: colorValue,
          width: 30,
          height: 30,
          borderRadius: 30,
          borderColor: colors.borderColorLight,
          borderWidth: 1,
        }}
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
              : colors.backgroundLight,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              fontSize: fontSize.large,
              fontFamily: fontFamily.PoppinsSemiBold600,
              // backgroundColor: "red",
              height: 50,
            },
          ]}
          placeholder="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
          cursorColor={colors.primaryPurple}
          selectionColor={colors.primaryPurple}
        />
        <TextInput
          style={[
            styles.input,
            {
              flex: 1,
              fontSize: fontSize.regular,
              fontFamily: fontFamily.PoppinsRegular400,
            },
          ]}
          placeholder="Content"
          value={content}
          onChangeText={(text) => setContent(text)}
          textAlignVertical="top"
          multiline
          cursorColor={colors.primaryPurple}
          selectionColor={colors.primaryPurple}
        />

        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginBottom: 10,
            justifyContent: "space-between",
            height: 40,
            alignItems: "center",
            // backgroundColor: "red",
          }}
        >
          {!showOptions && (
            <>
              <TouchableOpacity onPress={() => setShowOptions("tags")}>
                <Ionicons
                  name="pricetags-outline"
                  size={iconSize.regular}
                  color={colors.primaryPurple}
                  style={{
                    padding: 5,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowOptions("colors")}>
                <Ionicons
                  name="color-palette-outline"
                  size={iconSize.regular}
                  color={colors.primaryPurple}
                  style={{
                    padding: 5,
                  }}
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
                <Ionicons
                  name="close-outline"
                  size={iconSize.regular}
                  color={colors.buttonRed}
                  style={{
                    padding: 5,
                  }}
                />
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
                contentContainerStyle={{ alignItems: "center" }}
                ListFooterComponent={
                  <TouchableOpacity
                    onPress={() => navigation.navigate("SettingsTags")}
                    style={{
                      backgroundColor: colors.primaryGreenAlfa,
                      padding: 3,
                      paddingHorizontal: 10,
                      marginRight: 10,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: colors.borderColorLight,
                    }}
                  >
                    <Ionicons
                      // name="menu-outline"
                      name="add-outline"
                      size={iconSize.small}
                      color={colors.primaryPurple}
                    />
                  </TouchableOpacity>
                }
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
                <ColorComponent colorValue={colors.backgroundLight} />
                <ColorComponent colorValue={colors.customBackgroundNoteRed} />
                <ColorComponent colorValue={colors.customBackgroundNoteGreen} />
                <ColorComponent colorValue={colors.customBackgroundNoteBlue} />
              </View>
              <TouchableOpacity onPress={() => setShowOptions(null)}>
                <Ionicons
                  name="close-outline"
                  size={iconSize.regular}
                  color={colors.buttonRed}
                  style={{
                    padding: 5,
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <ButtonCustom
          title={data ? "Update" : "Add"}
          background={colors.primaryPurple}
          onPressFunc={() => {
            if (!activeLoading) {
              if (data) {
                handleUpdate();
              } else {
                handleAdd();
              }
            }
          }}
          active={activeLoading}
        />

        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          idNote={data ? data.id : null}
          source="EditNote"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    padding: 10,
    paddingBottom: 0,
  },
  input: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    // borderWidth: 1,
    borderColor: colors.borderColorLight,
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
    backgroundColor: colors.primaryPurple,
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderColor: colors.borderColorLight,
    borderWidth: 1,
  },
});
