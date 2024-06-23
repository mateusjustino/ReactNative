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
import CustomModal from "../components/CustomModal";
import colors from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";

const Settings = () => {
  const navigation = useNavigation();
  const { user, setUser, tags, setTags } = useContext(UserContext);
  const [tagName, setTagName] = useState("");
  const [theTagIsEditing, setTheTagIsEditing] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <Text>Tags:</Text>
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            },
            styles.inputView,
          ]}
        >
          <TextInput
            style={{ flex: 1 }}
            value={tagName}
            onChangeText={(text) => setTagName(text)}
            placeholder="Create a tag..."
          />
          {tagName ? (
            <>
              <TouchableOpacity onPress={addTag}>
                <Ionicons
                  name="checkmark"
                  size={24}
                  color={colors.primaryBlue}
                />
              </TouchableOpacity>
            </>
          ) : null}
        </View>
        {/* {tagName && (
          <TouchableOpacity style={styles.button} onPress={addTag}>
            <Text>Create tag: {tagName}</Text>
          </TouchableOpacity>
        )} */}

        <FlatList
          data={tags}
          renderItem={({ item }) => (
            <TagsSettings
              item={item}
              theTagIsEditing={theTagIsEditing}
              setTheTagIsEditing={setTheTagIsEditing}
              setModalVisible={setModalVisible}
              // isEditing={isEditingTag === item}
              // onEditItem={() => handleEditItem(item)}
            />
          )}
          scrollEnabled={false}
          style={{ marginVertical: 10 }}
        />

        <Text>darkmode</Text>
        <Text>config da conta</Text>
        <Text>config da conta</Text>
        <Text>config da conta</Text>
        <Text>config da conta</Text>
        <Text>config da conta</Text>
        <TouchableOpacity onPress={handleLogOut}>
          <Text>logout</Text>
        </TouchableOpacity>

        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          theTagIsEditing={theTagIsEditing}
          setTheTagIsEditing={setTheTagIsEditing}
        />
      </ScrollView>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: colors.backgroundWhite,
    padding: 10,
  },
  inputView: {
    // margin: 10,
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
});
