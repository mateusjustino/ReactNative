import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useContext, useState } from "react";
import Header from "../components/Header";
import { UserContext } from "../context/userContext";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConnection";
import TagsSettings from "../components/TagsSettings";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const Settings = () => {
  const navigation = useNavigation();
  const { user, setUser, tags, setTags } = useContext(UserContext);
  const [tagName, setTagName] = useState("");
  const [theTagIsEditing, setTheTagIsEditing] = useState(null);

  // const handleEditItem = (name) => {
  //   setIsEditingTag(name);
  // };

  const addTag = async () => {
    // setTags([]);
    if (tags.includes(tagName)) {
      console.log("ja existe");
      return;
    }
    let list = [...tags, tagName];
    list.sort((a, b) => a.localeCompare(b));
    await setDoc(doc(db, "settings", user.uid), {
      tags: list,
    });
    setTags(list);
    setTagName("");
  };

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate("SignIn");
        setUser({});
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Header fromSettings />
      <ScrollView style={styles.container}>
        <Text>Tags:</Text>
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
          scrollEnabled={false}
        />

        {/* <FlatList
          data={tags}
          renderItem={({ item }) => <Text>{item}</Text>}
          horizontal
          ItemSeparatorComponent={() => <Text>_</Text>}
        /> */}

        <Text>darkmode</Text>
        <Text>config da conta</Text>
        <Text>config da conta</Text>
        <Text>config da conta</Text>
        <Text>config da conta</Text>
        <Text>config da conta</Text>
        <TouchableOpacity onPress={handleLogOut}>
          <Text>logout</Text>
        </TouchableOpacity>
      </ScrollView>
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
