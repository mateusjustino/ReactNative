import {
  ActivityIndicator,
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
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import FavButton from "../components/FavButton";
import Header from "../components/Header";
import DraggableFlatList from "react-native-draggable-flatlist";
import { UserContext } from "../context/userContext";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [notesSearch, setNotesSearch] = useState([]);
  const [searchFilter, setSearchFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);
  const { selectedNotes, setSelectedNotes } = useContext(UserContext);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onSnapshot(
      query(collection(db, "notes"), orderBy("order")),
      (snapshot) => {
        const list = [];
        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            title: doc.data().title,
            contentText: doc.data().contentText,
            contentTextLower: doc.data().contentTextLower,
            createdAt: doc.data().createdAt,
            lastEditTime: doc.data().lastEditTime,
            order: doc.data().order,
            tags: doc.data().tags,
          });
        });
        setNotes(list);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAdjustOrder = async ({ data, from, to }) => {
    // console.log("notes", notes);
    // console.log("data", data);
    let needUpdate = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id !== notes[i].id) {
        needUpdate = true;
      }
    }
    if (needUpdate) {
      console.log("need update exec");
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
              list.push({
                id: doc.id,
                title: doc.data().title,
                contentText: doc.data().contentText,
                contentTextLower: doc.data().contentTextLower,
                createdAt: doc.data().createdAt,
                lastEditTime: doc.data().lastEditTime,
                order: doc.data().order,
                tags: doc.data().tags,
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
              list.push({
                id: doc.id,
                title: doc.data().title,
                contentText: doc.data().contentText,
                contentTextLower: contentTextLower,
                createdAt: doc.data().createdAt,
                lastEditTime: doc.data().lastEditTime,
                order: doc.data().order,
                tags: doc.data().tags,
              });
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

  const tagsData = ["a", "b", "c"];

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }
  return (
    <>
      <Header showContent />
      <View style={{ flex: 1, alignItems: "center" }}>
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
                }}
              >
                <TouchableOpacity onPress={() => setSelectedNotes([])}>
                  <Text>ClearNotes</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                value={searchText}
                onChangeText={(text) => searchNotes("input", text)}
                placeholder="search..."
              />
              <View
                style={{
                  margin: 10,
                  flexDirection: "row",
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
                        onPress={() => searchNotes("tags", item)}
                      >
                        <Text>{item}</Text>
                      </TouchableOpacity>
                    );
                  }}
                  horizontal
                />
              </View>
            </>
          )}
        </View>
        <Text>{draggingItem?.title}</Text>
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tag: {
    width: 35,
    height: 20,
    backgroundColor: "gray",
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
    marginEnd: 20,
    borderWidth: 1,
  },
  favContainer: {
    position: "absolute",
    bottom: 30,
  },
  favButton: {},
  input: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    lineHeight: 20,
  },
});

export default Home;
