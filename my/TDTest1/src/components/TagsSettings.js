import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
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
import { Feather } from "@expo/vector-icons";
import colors from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";

const TagsSettings = ({
  item,
  theTagIsEditing,
  setTheTagIsEditing,
  setModalVisible,
}) => {
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
    if (item != tagNameItem) {
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
    }

    setTheTagIsEditing(null);
  };

  const delTag = async (item) => {
    setModalVisible(true);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        height: 50,
        borderBottomWidth: theTagIsEditing ? 0 : 1,
        borderRadius: 10,
        borderColor: "rgba(0,0,0,.1)",
        // backgroundColor: "red",
        marginVertical: 5,
      }}
    >
      {editItem ? (
        <View
          style={[
            styles.input,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderRadius: 10,
              borderWidth: 1,
              height: 50,
              borderColor: "rgba(0,0,0,0.1)",
              paddingHorizontal: 10,
            },
          ]}
        >
          <TextInput
            value={tagNameItem}
            onChangeText={(text) => setTagNameItem(text)}
            style={{ width: "80%" }}
          />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity onPress={() => delTag(item)}>
              <Ionicons name="trash-outline" size={20} color="red" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmEditing(item, tagNameItem)}>
              <Ionicons name="checkmark" size={24} color={colors.primaryBlue} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            // backgroundColor: "red",
            width: "100%",
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ width: "80%" }} numberOfLines={1}>
            #{tagNameItem}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setTheTagIsEditing(item);
            }}
          >
            <Feather name="edit" size={20} color={colors.primaryBlue} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TagsSettings;

const styles = StyleSheet.create({
  input: {},
});
