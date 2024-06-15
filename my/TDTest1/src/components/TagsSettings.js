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
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConnection";

const TagsSettings = ({ item, theTagIsEditing, setTheTagIsEditing }) => {
  const { user, tags, setTags } = useContext(UserContext);
  const [tagNameItem, setTagNameItem] = useState(item);
  const [editItem, setEditItem] = useState(false);

  useEffect(() => {
    console.log(theTagIsEditing);
    if (theTagIsEditing === item) {
      setEditItem(true);
    } else {
      setEditItem(false);
    }
  }, [theTagIsEditing]);

  const confirmEditing = async (oldTag, newTag) => {
    let list = tags;
    const indexItem = list.indexOf(oldTag);
    if (indexItem !== -1) {
      list[indexItem] = newTag;
    }

    await setDoc(doc(db, "settings", user.uid), {
      tags: list,
    });
    setTags(list);

    setTheTagIsEditing(null);
  };

  const delTag = () => {
    console.log("del");
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
        height: 50,
        borderRadius: 10,
      }}
    >
      {editItem ? (
        <>
          <TextInput
            value={tagNameItem}
            onChangeText={(text) => setTagNameItem(text)}
          />
          <TouchableOpacity onPress={delTag}>
            <Text>del</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmEditing(item, tagNameItem)}>
            <Text>ok</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text>#{tagNameItem}</Text>
          <TouchableOpacity onPress={() => setTheTagIsEditing(item)}>
            <Text>Edit</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default TagsSettings;

const styles = StyleSheet.create({});
