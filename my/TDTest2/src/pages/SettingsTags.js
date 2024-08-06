import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useState } from "react";
import Header from "../components/Header";
import { fontFamily, fontSize } from "../theme/font";
import colors from "../theme/colors";
import { UserContext } from "../context/userContext";
import TagsSettings from "../components/TagsSettings";
import CustomModal from "../components/CustomModal";
import { FontAwesome6 } from "@expo/vector-icons";
import { iconSize } from "../theme/icon";
import Loading from "../components/Loading";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConnection";

const SettingsTags = () => {
  const { tags, user, setTags } = useContext(UserContext);
  const [tagName, setTagName] = useState("");
  const [theTagIsEditing, setTheTagIsEditing] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeLoading, setActiveLoading] = useState(false);

  const addTag = async () => {
    setActiveLoading(true);
    if (tags.includes(tagName)) {
      console.log("ja existe");
      return;
    }
    let list = [...tags, tagName];
    list.sort((a, b) => a.localeCompare(b));

    const settingsRef = doc(db, "settings", user.uid);
    await updateDoc(settingsRef, {
      tags: list,
    });

    // await setDoc(doc(db, "settings", user.uid), {
    //   tags: list,
    // });
    setTags(list);
    setTagName("");
    setActiveLoading(false);
  };

  return (
    <>
      <Header fromSettings settingsTitle="Tags" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ alignItems: "center" }}
      >
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
            style={{
              flex: 1,
              fontSize: fontSize.regular,
              fontFamily: fontFamily.PoppinsRegular400,
            }}
            value={tagName}
            onChangeText={(text) => setTagName(text)}
            placeholder="Create a tag..."
            cursorColor={colors.primaryPurple}
            selectionColor={colors.primaryPurple}
          />
          {tagName ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  if (!activeLoading) {
                    addTag();
                  }
                }}
              >
                {activeLoading ? (
                  <Loading />
                ) : (
                  <FontAwesome6
                    name="plus"
                    size={iconSize.regular}
                    color={colors.primaryPurple}
                  />
                )}
              </TouchableOpacity>
            </>
          ) : null}
        </View>

        <FlatList
          data={tags}
          renderItem={({ item }) => (
            <TagsSettings
              item={item}
              theTagIsEditing={theTagIsEditing}
              setTheTagIsEditing={setTheTagIsEditing}
              setModalVisible={setModalVisible}
            />
          )}
          scrollEnabled={false}
          style={{ marginVertical: 10 }}
        />

        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          theTagIsEditing={theTagIsEditing}
          setTheTagIsEditing={setTheTagIsEditing}
          source="SettingsTags"
        />
      </ScrollView>
    </>
  );
};

export default SettingsTags;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLight,
    padding: 10,
  },
  inputView: {
    marginVertical: 10,
    padding: 10,
    paddingTop: 10,
    paddingBottom: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderColorLight,
  },
});
