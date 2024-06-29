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
import { FontAwesome6 } from "@expo/vector-icons";
import { fontFamily, fontSize } from "../theme/font";
import { iconSize } from "../theme/icon";
import Loading from "../components/Loading";

const Settings = () => {
  const navigation = useNavigation();
  const { user, setUser, tags, setTags } = useContext(UserContext);
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
    await setDoc(doc(db, "settings", user.uid), {
      tags: list,
    });
    setTags(list);
    setTagName("");
    setActiveLoading(false);
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
        <Text
          style={{
            fontSize: fontSize.regular,
            fontFamily: fontFamily.PoppinsRegular400,
          }}
        >
          Tags:
        </Text>
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
                    color={colors.primaryBlue}
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
    backgroundColor: colors.backgroundLight,
    padding: 10,
  },
  inputView: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderColorLight,
  },
});
