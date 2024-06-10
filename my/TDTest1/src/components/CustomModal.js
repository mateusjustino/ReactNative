import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import React, { useContext, useState } from "react";
import { db } from "../firebaseConnection";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { UserContext } from "../context/userContext";
import Tags from "./Tags";

const CustomModal = ({
  modalVisible,
  setModalVisible,
  activeTags,
  setActiveTags,
}) => {
  const [tagName, setTagName] = useState("");
  const { user, tags, setTags } = useContext(UserContext);

  const addTags = async () => {
    let list = [...tags, tagName];
    await setDoc(doc(db, "settings", user.uid), {
      tags: list,
    });
    setTags(list);
    setModalVisible(false);
    setTagName("");
  };

  const activeTagsFunction = (tag) => {
    setActiveTags((prevTags) => {
      if (prevTags.includes(tag)) {
        // Se a tag já existe, remove-a
        return prevTags.filter((t) => t !== tag).sort();
      } else {
        // Se a tag não existe, adiciona-a
        return [...prevTags, tag].sort();
      }
    });
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        // Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
        onPress={() => setModalVisible(!modalVisible)}
        activeOpacity={1}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            width: "100%",
          }}
        >
          <TextInput
            style={styles.input}
            value={tagName}
            onChangeText={(text) => setTagName(text)}
          />
          <TouchableOpacity onPress={addTags}>
            <Text>AddTag</Text>
          </TouchableOpacity>

          <View
            style={{
              margin: 10,
              flexDirection: "row",
              width: "100%",
              padding: 10,
            }}
          >
            <FlatList
              data={tags}
              renderItem={({ item }) => {
                return (
                  <Tags
                    item={item}
                    activeTags={activeTags}
                    onPressFunc={() => activeTagsFunction(item)}
                  />
                );
                // <TouchableOpacity
                //   style={[
                //     styles.tag,
                //     Array.isArray(activeTags) && activeTags.includes(item)
                //       ? { borderColor: "green" }
                //       : { borderColor: "red" },
                //   ]}
                //   onPress={() => activeTagsFunction(item)}
                // >
                //   <Text>{item}</Text>
                // </TouchableOpacity>
              }}
              horizontal
            />
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={{ fontSize: 30 }}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  input: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    lineHeight: 20,
  },
});
