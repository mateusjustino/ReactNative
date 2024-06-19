import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import NoteList from "../components/NoteList";
import { db } from "../firebaseConnection";
import {
  collection,
  deleteDoc,
  doc,
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
import Loading from "../components/Loading";
import { useFocusEffect } from "@react-navigation/native";
import CustomModal from "../components/CustomModal";
import Tags from "../components/Tags";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [notesSearch, setNotesSearch] = useState([]);
  const [searchFilter, setSearchFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [forceUpdate, setForceUpdate] = useState(false);

  const { selectedNotes, setSelectedNotes, user, setUser, tags, setTags } =
    useContext(UserContext);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribeNotes = onSnapshot(
      query(collection(db, "notes"), orderBy("order")),
      (snapshot) => {
        const list = [];
        snapshot.forEach((doc) => {
          if (user.uid === doc.data().uid) {
            list.push({
              id: doc.id,
              uid: doc.data().uid,
              title: doc.data().title,
              contentText: doc.data().contentText,
              contentTextLower: doc.data().contentTextLower,
              createdAt: doc.data().createdAt,
              lastEditTime: doc.data().lastEditTime,
              order: doc.data().order,
              tags: doc.data().tags,
              backgroundColor: doc.data().backgroundColor,
            });
          }
        });
        setNotes(list);
        setIsLoading(false);
      }
    );

    // setUpdateListTags([...tags]);

    return () => unsubscribeNotes();
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      // setTags([...tags]);
      setForceUpdate((prev) => !prev);
    }, [])
  );

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
        .then(() => console.log("Ordem atualizada no Firestore"))
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
      const unsubscribe = onSnapshot(
        query(collection(db, "notes"), orderBy("order")),
        (snapshot) => {
          const list = [];
          snapshot.forEach((doc) => {
            const tagsFromNote = doc.data().tags;
            if (containsAllElements(tagsFromNote, activeTagsList)) {
              // Faça algo se tagsFromNote contém todos os elementos de activeTagsList
              if (user.uid === doc.data().uid) {
                list.push({
                  id: doc.id,
                  uid: doc.data().uid,
                  title: doc.data().title,
                  contentText: doc.data().contentText,
                  contentTextLower: doc.data().contentTextLower,
                  createdAt: doc.data().createdAt,
                  lastEditTime: doc.data().lastEditTime,
                  order: doc.data().order,
                  tags: doc.data().tags,
                  backgroundColor: doc.data().backgroundColor,
                });
              }
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
      );
    }
    if (fromWhere === "input") {
      setSearchText(item);
      if (!item) {
        return;
      }
      setActiveTags([]);
      setSearchFilter(true);
      const searchTextLower = item.toLowerCase();
      const unsubscribe = onSnapshot(
        query(collection(db, "notes"), orderBy("order")),
        (snapshot) => {
          const list = [];
          snapshot.forEach((doc) => {
            const contentTextLower = doc.data().contentTextLower;
            if (contentTextLower.includes(searchTextLower)) {
              if (user.uid === doc.data().uid) {
                list.push({
                  id: doc.id,
                  uid: doc.data().uid,
                  title: doc.data().title,
                  contentText: doc.data().contentText,
                  contentTextLower: doc.data().contentTextLower,
                  createdAt: doc.data().createdAt,
                  lastEditTime: doc.data().lastEditTime,
                  order: doc.data().order,
                  tags: doc.data().tags,
                  backgroundColor: doc.data().backgroundColor,
                });
              }
            }
          });
          setNotesSearch(list);
        }
      );
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

  const handleDeleteSelectedNotes = async () => {
    for (let i = 0; i < selectedNotes.length; i++) {
      console.log(selectedNotes[i].title);
      await deleteDoc(doc(db, "notes", selectedNotes[i].id));
    }
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <Header fromHome />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingHorizontal: 15,
          paddingTop: 10,
        }}
      >
        <View
          style={{
            width: "100%",
          }}
        >
          {selectedNotes.length !== 0 ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  // gap: 10,
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity onPress={() => setSelectedNotes([])}>
                  <Text>ClearSelectedNotes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteSelectedNotes}>
                  <Text>DeleteNotes</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                value={searchText}
                onChangeText={(text) => searchNotes("input", text)}
                placeholder="Search..."
              />
              <View
                style={{
                  // margin: 10,
                  flexDirection: "row",
                  // width: "100%",
                  // padding: 10,
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
                />
              </View>
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
          // scrollEnabled={false}
          containerStyle={{ width: "100%", flex: 1 }}
          style={{}}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.favContainer}>
          <FavButton style={styles.favButton} />
        </View>

        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  favContainer: {
    position: "absolute",
    bottom: 30,
  },
  favButton: {},
  input: {
    // margin: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    lineHeight: 20,
    borderColor: "rgba(0,0,0,0.1)",
  },
});

export default Home;
