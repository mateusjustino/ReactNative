import {
  ActivityIndicator,
  Button,
  FlatList,
  ScrollView,
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
import { useFocusEffect } from "@react-navigation/native";
import DraggableFlatList from "react-native-draggable-flatlist";
import notesOrder from "../scripts/notesOrder";
import { UserContext } from "../context/userContext";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [notesSearch, setNotesSearch] = useState([]);
  const [searchFilter, setSearchFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // const { searchText, setSearchText } = useContext(UserContext);
  const [searchText, setSearchText] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  // console.log(searchText);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onSnapshot(
      // query(collection(db, "notes"), orderBy("order", "asc")),
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

    // console.log("useefeccttasdas");
    return () => unsubscribe();
  }, []);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // console.log("usefocuseffesctttt");
  //   }, [])
  // );

  const handleAdjustOrder = async ({ data, from, to }) => {
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
  };

  const searchNotes = async (fromWhere, item) => {
    setSearchFilter(false);
    if (fromWhere === "tags") {
      console.log("search pelas tags executada");
      let activeTagsList = activeTags;
      if (activeTagsList.includes(item)) {
        // Se a tag já existe, remove-a
        activeTagsList = activeTagsList.filter((t) => t !== item).sort();
      } else {
        // Se a tag não existe, adiciona-a
        activeTagsList = [...activeTagsList, item].sort();
      }
      // console.log(activeTagsList);
      setActiveTags(activeTagsList);
      // Mostra a lista atualizada
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
          // if (list.length !== 0) {
          //   setSearchText("");
          //   setSearchFilter(true);
          //   setNotesSearch(list);
          // }
          // setSearchText("");
          // setSearchFilter(true);
          // setNotesSearch(list);
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
        {/* <ScrollView style={{ flex: 1 }}> */}

        <View
          style={{
            // backgroundColor: "red",
            width: "100%",
          }}
        >
          <TextInput
            style={styles.input}
            value={searchText}
            // onChangeText={(text) => setSearchText(text)}
            onChangeText={(text) => searchNotes("input", text)}
            placeholder="search..."
          />
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
                    onPress={() => searchNotes("tags", item)}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                );
              }}
              horizontal
            />
          </View>
        </View>

        <Text>{searchFilter ? "true" : "false"}</Text>
        <DraggableFlatList
          data={searchFilter ? notesSearch : notes}
          keyExtractor={(item) => item.id}
          onDragEnd={handleAdjustOrder}
          renderItem={({ item, drag }) => (
            <NoteList data={item} drag={searchFilter ? null : drag} />
          )}
          // scrollEnabled={false}
          containerStyle={{ width: "100%", flex: 1 }}
          style={{}}
          showsVerticalScrollIndicator={false}
        />

        {/* </ScrollView> */}
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
    // right: 100,
  },
  favButton: {
    // position: "absolute",
    // bottom: 20,
  },
  input: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    lineHeight: 20,
    // width: "100%",
  },
});

export default Home;
