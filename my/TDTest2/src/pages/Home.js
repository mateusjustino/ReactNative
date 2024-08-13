import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import NoteList from "../components/NoteList";
import { db } from "../firebaseConnection";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import FavButton from "../components/FavButton";
import Header from "../components/Header";
import DraggableFlatList from "react-native-draggable-flatlist";
import { UserContext } from "../context/userContext";
import LoadingScreen from "../components/LoadingScreen";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import CustomModal from "../components/CustomModal";
import Tags from "../components/Tags";
import colors from "../theme/colors";
import { iconSize } from "../theme/icon";
import { Ionicons } from "@expo/vector-icons";
import { fontFamily, fontSize } from "../theme/font";
import { configureNavigationBar } from "../scripts/NavigationBar";
import ButtonCustom from "../components/ButtonCustom";
import CloudButton from "../components/CloudButton";

const Home = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [notes, setNotes] = useState([]);
  const [notesSearch, setNotesSearch] = useState([]);
  const [searchFilter, setSearchFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [forceUpdate, setForceUpdate] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const { selectedNotes, setSelectedNotes, user, tags } =
    useContext(UserContext);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      setForceUpdate((prev) => !prev);
      configureNavigationBar(colors.backgroundLight);

      updateDocs();

      if (activeTags.length !== 0 || searchText !== "") {
        updateDocsFiltered();
      }

      setIsLoading(false);
    }, [activeTags, searchText, selectedNotes, user])
  );

  const updateDocs = async () => {
    const q = query(
      collection(db, "notes"),
      orderBy("order"),
      where("uid", "==", user.uid)
    );

    const querySnapshot = await getDocs(q);
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({
        id: doc.id,
        uid: doc.data().uid,
        title: doc.data().title,
        contentText: doc.data().contentText,
        createdAt: doc.data().createdAt,
        lastEditTime: doc.data().lastEditTime,
        order: doc.data().order,
        tags: doc.data().tags,
        backgroundColor: doc.data().backgroundColor,
      });
    });
    setNotes(list);
  };

  const updateDocsFiltered = async () => {
    if (activeTags.length !== 0) {
      // console.log("tem tag ativa");
      const q = query(
        collection(db, "notes"),
        orderBy("order"),
        where("uid", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((doc) => {
        const tagsFromNote = doc.data().tags;
        if (containsAllElements(tagsFromNote, activeTags)) {
          // Faça algo se tagsFromNote contém todos os elementos de activeTagsList
          list.push({
            id: doc.id,
            uid: doc.data().uid,
            title: doc.data().title,
            contentText: doc.data().contentText,
            createdAt: doc.data().createdAt,
            lastEditTime: doc.data().lastEditTime,
            order: doc.data().order,
            tags: doc.data().tags,
            backgroundColor: doc.data().backgroundColor,
          });
        }
      });
      setNotesSearch(list);
    }

    // SEMPRE CONFERIR SE ESTE AQUI ESTA ATUALIZADO IGUAL O PRINCIPALLLLLLLLLLLLLLLLLLLLLLLLLLLL
    if (searchText !== "") {
      const list = [];
      const itemLowerCase = searchText.trim().toLowerCase();

      const q = query(
        collection(db, "notes"),
        orderBy("order"),
        where("uid", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const contentTextLowerCase = doc.data().contentText.toLowerCase();
        const titleLowerCase = doc.data().title.toLowerCase();

        if (
          titleLowerCase.includes(itemLowerCase) ||
          contentTextLowerCase.includes(itemLowerCase)
        ) {
          list.push({
            id: doc.id,
            uid: doc.data().uid,
            title: doc.data().title,
            contentText: doc.data().contentText,
            createdAt: doc.data().createdAt,
            lastEditTime: doc.data().lastEditTime,
            order: doc.data().order,
            tags: doc.data().tags,
            backgroundColor: doc.data().backgroundColor,
          });
        }
      });
      setNotesSearch(list);
    }
  };

  const handleAdjustOrder = async ({ data, from, to }) => {
    let needUpdate = false;
    // checo se as order de alguma nota foi alterada, faço isso pela ordem dos ids
    for (let i = 0; i < data.length; i++) {
      if (data[i].id !== notes[i].id) {
        needUpdate = true;
      }
    }
    if (needUpdate) {
      setNotes(data);
      // Itera sobre os itens reordenados e atualiza a ordem dos documentos no Firestore
      await Promise.all(
        data.map(async (item, index) => {
          const noteRef = doc(db, "notes", item.id);
          await updateDoc(noteRef, { order: index });
        })
      )
        .then(() => {
          // setNotes(data);
        })
        .catch((error) =>
          console.log("Erro ao atualizar a ordem no Firestore:", error)
        );
    } else {
      setSelectedNotes([draggingItem]);
    }
  };

  const searchNotes = async (fromWhere, item) => {
    // com o searchFilter eu digo se algum meio de pesquisa esta ativo
    setSearchFilter(false);

    if (fromWhere === "tags") {
      let activeTagsList = activeTags;
      if (activeTagsList.includes(item)) {
        // Se a tag já existe, remove-a
        activeTagsList = activeTagsList.filter((t) => t !== item).sort();
      } else {
        // Se a tag não existe, adiciona-a
        activeTagsList = [...activeTagsList, item].sort();
      }
      setActiveTags(activeTagsList);

      const q = query(
        collection(db, "notes"),
        orderBy("order"),
        where("uid", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((doc) => {
        const tagsFromNote = doc.data().tags;
        if (containsAllElements(tagsFromNote, activeTagsList)) {
          // Faça algo se tagsFromNote contém todos os elementos de activeTagsList
          list.push({
            id: doc.id,
            uid: doc.data().uid,
            title: doc.data().title,
            contentText: doc.data().contentText,
            createdAt: doc.data().createdAt,
            lastEditTime: doc.data().lastEditTime,
            order: doc.data().order,
            tags: doc.data().tags,
            backgroundColor: doc.data().backgroundColor,
          });
        }
      });
      if (activeTagsList.length !== 0) {
        setSearchText("");
        setSearchFilter(true);
        setNotesSearch(list);
      } else {
        setSearchFilter(false);
      }
    }
    if (fromWhere === "input") {
      setSearchText(item);
      if (!item) {
        return;
      }
      setActiveTags([]);
      setSearchFilter(true);

      const list = [];
      const itemLowerCase = searchText.trim().toLowerCase();

      const q = query(
        collection(db, "notes"),
        orderBy("order"),
        where("uid", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const contentTextLowerCase = doc.data().contentText.toLowerCase();
        const titleLowerCase = doc.data().title.toLowerCase();

        if (
          titleLowerCase.includes(itemLowerCase) ||
          contentTextLowerCase.includes(itemLowerCase)
        ) {
          list.push({
            id: doc.id,
            uid: doc.data().uid,
            title: doc.data().title,
            contentText: doc.data().contentText,
            createdAt: doc.data().createdAt,
            lastEditTime: doc.data().lastEditTime,
            order: doc.data().order,
            tags: doc.data().tags,
            backgroundColor: doc.data().backgroundColor,
          });
        }
      });
      setNotesSearch(list);
    }
  };

  function containsAllElements(array1, array2) {
    const set1 = new Set(array1);
    for (let item of array2) {
      if (!set1.has(item)) {
        return false;
      }
    }
    return true;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <>
      <Header fromHome />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingHorizontal: 10,
          paddingTop: 10,
          backgroundColor: colors.backgroundLight,
          // backgroundColor: "red",
        }}
      >
        <View
          style={{
            width: "100%",
            // height: 100,
            alignItems: "center",
            marginTop: 10,
            gap: 10,
            // backgroundColor: "red",
            marginBottom: 25,
          }}
        >
          {selectedNotes.length !== 0 ? (
            <>
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  // paddingBottom: 10,
                }}
              >
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: colors.borderColorLight,
                    borderRadius: 10,
                    width: "100%",
                    // padding: 10,
                    // gap: 10,
                    // backgroundColor: "red",
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSize.regular,
                      fontFamily: fontFamily.PoppinsRegular400,
                      padding: 10,
                      paddingBottom: 7,
                      // backgroundColor: "pink",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSize.regular,
                        fontFamily: fontFamily.PoppinsSemiBold600,
                      }}
                    >
                      {selectedNotes.length}
                    </Text>
                    {selectedNotes.length == 1
                      ? " nota selecionada"
                      : " notas selecionadas"}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      // backgroundColor: "yellow",
                    }}
                  >
                    <TouchableOpacity onPress={() => setSelectedNotes([])}>
                      <Ionicons
                        name="close"
                        size={iconSize.regular}
                        color={colors.buttonRed}
                        style={{ padding: 10 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                      <Ionicons
                        name="trash-outline"
                        size={iconSize.regular}
                        color={colors.buttonRed}
                        style={{ padding: 10 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: isFocused
                      ? colors.primaryPurpleAlfa
                      : colors.borderColorLight,
                  },
                ]}
                value={searchText}
                onChangeText={(text) => searchNotes("input", text)}
                placeholder="Search..."
                cursorColor={colors.primaryPurpleAlfa}
                selectionColor={colors.primaryPurpleAlfa}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoCapitalize="none"
              />
              {tags.length !== 0 && (
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <FlatList
                    data={tags}
                    renderItem={({ item }) => {
                      return (
                        <Tags
                          item={item}
                          activeTags={activeTags}
                          onPressFunc={() => searchNotes("tags", item)}
                        />
                      );
                    }}
                    horizontal
                    extraData={forceUpdate}
                    showsHorizontalScrollIndicator={false}
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
            </>
          )}
        </View>
        <DraggableFlatList
          data={searchFilter ? notesSearch : notes}
          keyExtractor={(item) => item.id}
          onDragBegin={(index) => {
            setDraggingItem(searchFilter ? notesSearch[index] : notes[index]);
          }}
          onDragEnd={handleAdjustOrder}
          renderItem={({ item, drag }) => (
            <NoteList
              data={item}
              drag={
                searchFilter || selectedNotes.length !== 0 ? () => {} : drag
              }
            />
          )}
          containerStyle={{
            width: "100%",
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.favContainer}>
          <CloudButton onPress={() => navigation.navigate("AddEditNote")} />
          {/* <ButtonCustom
            icon={
              <Ionicons
                name="pencil-outline"
                size={iconSize.regular}
                color={colors.backgroundLight}
              />
            }
            background={colors.primaryPurple}
            heightBtn={50}
            onPressFunc={() => navigation.navigate("AddEditNote")}
          /> */}
        </View>

        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          selectedNotes={selectedNotes}
          source="Home"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  favContainer: {
    position: "absolute",
    bottom: 20,
    // width: 60,
  },

  input: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderColorLight,
    width: "100%",
    fontSize: fontSize.regular,
    fontFamily: fontFamily.PoppinsRegular400,
    // backgroundColor: colors.primaryGreenDark,
  },
});

export default Home;
