import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useState } from "react";
import Header from "../components/Header";
import { UserContext } from "../context/userContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConnection";
import TagsSettings from "../components/TagsSettings";

const Settings = () => {
  const { user, tags, setTags } = useContext(UserContext);
  const [tagName, setTagName] = useState("");
  const [theTagIsEditing, setTheTagIsEditing] = useState(null);

  // const handleEditItem = (name) => {
  //   setIsEditingTag(name);
  // };

  const addTag = async () => {
    if (tags.includes(tagName)) {
      console.log("ja existe");
      return;
    }
    let list = [...tags, tagName];
    await setDoc(doc(db, "settings", user.uid), {
      tags: list,
    });
    setTags(list);
    // setModalVisible(false);
    setTagName("");
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text>Settings Screen</Text>
        <TextInput
          style={styles.input}
          value={tagName}
          onChangeText={(text) => setTagName(text)}
          placeholder="Enter a tag"
        />
        {tagName && (
          <TouchableOpacity
            style={{ backgroundColor: "blue" }}
            onPress={addTag}
          >
            <Text>Add: {tagName}</Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={tags}
          renderItem={({ item }) => (
            <TagsSettings
              item={item}
              theTagIsEditing={theTagIsEditing}
              setTheTagIsEditing={setTheTagIsEditing}
              // isEditing={isEditingTag === item}
              // onEditItem={() => handleEditItem(item)}
            />
          )}
        />
      </View>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "red",
  },
  input: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    lineHeight: 20,
  },
});
