import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConnection";

const TagsSettings = ({ item, theTagIsEditing, setTheTagIsEditing }) => {
  const { user, tags, setTags } = useContext(UserContext);
  const [tagNameItem, setTagNameItem] = useState(item);
  const [editItem, setEditItem] = useState(false);

  useEffect(() => {
    if (theTagIsEditing === item) {
      setEditItem(true);
    } else {
      setEditItem(false);
    }
    setTagNameItem(item);
  }, [theTagIsEditing, item]);

  const confirmEditing = async (oldTag, newTag) => {
    let list = tags;
    const indexItem = list.indexOf(oldTag);
    if (indexItem !== -1) {
      list[indexItem] = newTag;
    }

    list.sort((a, b) => a.localeCompare(b));
    setTags(list);
    await setDoc(doc(db, "settings", user.uid), {
      tags: list,
    });

    setTheTagIsEditing(null);
  };

  const delTag = async (item) => {
    setTags([]);
    let list = tags;
    const indexItem = list.indexOf(item);
    if (indexItem !== -1) {
      list.splice(indexItem, 1);
    }

    list.sort((a, b) => a.localeCompare(b));
    setTags(list);
    await setDoc(doc(db, "settings", user.uid), {
      tags: list,
    }).then(async () => {
      const q = query(collection(db, "notes"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (document) => {
        if (user.uid === document.data().uid) {
          let listTags = document.data().tags;
          const indexItem = listTags.indexOf(item);
          if (indexItem !== -1) {
            listTags.splice(indexItem, 1);
            const ref = doc(db, "notes", document.id);
            await updateDoc(ref, {
              tags: listTags,
            })
              .then(() => console.log("tudo certo"))
              .catch((error) => console.log(error.message));
          }
        }
      });
    });

    setTheTagIsEditing(null);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: 1,
        alignItems: "center",
        margin: 10,
        padding: 10,
        borderRadius: 10,
        height: 60,
      }}
    >
      {editItem ? (
        <>
          <TextInput
            value={tagNameItem}
            onChangeText={(text) => setTagNameItem(text)}
            style={styles.input}
          />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={() => delTag(item)}
              style={{
                borderWidth: 1,
                borderRadius: 10,
                borderColor: "red",
                paddingHorizontal: 10,
              }}
            >
              <Text>del</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => confirmEditing(item, tagNameItem)}
              style={{
                borderWidth: 1,
                borderRadius: 10,
                borderColor: "green",
                paddingHorizontal: 10,
              }}
            >
              <Text>ok</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text>#{tagNameItem}</Text>
          <TouchableOpacity
            onPress={() => setTheTagIsEditing(item)}
            style={{
              borderWidth: 1,
              borderRadius: 10,
              borderColor: "blue",
              paddingHorizontal: 10,
            }}
          >
            <Text>edit</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default TagsSettings;

const styles = StyleSheet.create({
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});
