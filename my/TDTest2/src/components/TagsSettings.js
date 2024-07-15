import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
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
  where,
} from "firebase/firestore";
import { db } from "../firebaseConnection";
import { Feather } from "@expo/vector-icons";
import colors from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { fontFamily, fontSize } from "../theme/font";
import { iconSize } from "../theme/icon";
import Loading from "./Loading";

const TagsSettings = ({
  item,
  theTagIsEditing,
  setTheTagIsEditing,
  setModalVisible,
}) => {
  const { user, tags, setTags } = useContext(UserContext);
  const [tagNameItem, setTagNameItem] = useState(item);
  const [editItem, setEditItem] = useState(false);
  const [activeLoading, setActiveLoading] = useState(false);

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
      setActiveLoading(true);
      if (tags.includes(tagNameItem)) {
        console.log("ja existe");
        alert("já existe");
        return;
      }

      let list = tags;
      const indexItem = list.indexOf(oldTag);
      if (indexItem !== -1) {
        list[indexItem] = newTag;
      }

      list.sort((a, b) => a.localeCompare(b));
      setTags(list);

      const settingsRef = doc(db, "settings", user.uid);
      await updateDoc(settingsRef, {
        tags: list,
      }).then(async () => {
        console.log("-".repeat("99"));
        const q = query(collection(db, "notes"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (document) => {
          let listOldTags = document.data().tags;
          const indexItem = listOldTags.indexOf(oldTag);
          if (indexItem !== -1) {
            listOldTags[indexItem] = newTag;
            listOldTags.sort((a, b) => a.localeCompare(b));

            const noteRef = doc(db, "notes", document.id);
            await updateDoc(noteRef, {
              tags: listOldTags,
            });
          }
        });
      });

      // await setDoc(doc(db, "settings", user.uid), {
      //   tags: list,
      // }).then(async () => {
      //   console.log("-".repeat("99"));
      //   const q = query(collection(db, "notes"), where("uid", "==", user.uid));
      //   const querySnapshot = await getDocs(q);
      //   querySnapshot.forEach(async (document) => {
      //     let listOldTags = document.data().tags;
      //     const indexItem = listOldTags.indexOf(oldTag);
      //     if (indexItem !== -1) {
      //       listOldTags[indexItem] = newTag;
      //       listOldTags.sort((a, b) => a.localeCompare(b));

      //       const noteRef = doc(db, "notes", document.id);
      //       await updateDoc(noteRef, {
      //         tags: listOldTags,
      //       });
      //     }
      //   });
      // });
      setActiveLoading(false);
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
        paddingVertical: 5,
        height: 60,
        borderBottomWidth: theTagIsEditing ? 0 : 1,
        borderRadius: 10,
        borderColor: colors.borderColorLight,
        marginVertical: 3,
        // backgroundColor: "lightgreen",
        // paddingHorizontal: 10,
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
              borderColor: colors.borderColorLight,

              padding: 10,
              paddingStart: 17.5,
              // backgroundColor: "red",
            },
          ]}
        >
          <TextInput
            value={tagNameItem}
            onChangeText={(text) => setTagNameItem(text)}
            style={{
              width: "80%",
              fontSize: fontSize.regular,
              fontFamily: fontFamily.PoppinsRegular400,
            }}
            cursorColor={colors.primaryBlue}
            selectionColor={colors.primaryBlue}
          />
          <View style={{ flexDirection: "row", gap: 20 }}>
            <TouchableOpacity onPress={() => delTag(item)}>
              <Ionicons
                name="trash-outline"
                size={iconSize.regular}
                color="red"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!activeLoading) {
                  confirmEditing(item, tagNameItem);
                }
              }}
            >
              {activeLoading ? (
                <Loading />
              ) : (
                <Ionicons
                  name="checkmark"
                  size={iconSize.regular}
                  color={colors.primaryBlue}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingHorizontal: 10,
            paddingStart: 5,
            // paddingVertical: 7,
            // height: 29,
          }}
          onPress={() => {
            setTheTagIsEditing(item);
          }}
        >
          <Text
            style={{
              width: "85%",
              fontSize: fontSize.regular,
              fontFamily: fontFamily.PoppinsRegular400,
            }}
            numberOfLines={1}
          >
            #{tagNameItem}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setTheTagIsEditing(item);
            }}
          >
            <Feather
              name="edit"
              size={iconSize.regular}
              color={colors.primaryBlue}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TagsSettings;

const styles = StyleSheet.create({
  input: {},
});
