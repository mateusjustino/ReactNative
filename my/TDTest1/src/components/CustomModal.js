import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Button,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebaseConnection";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { UserContext } from "../context/userContext";
import { useNavigation } from "@react-navigation/native";
import { fontSize } from "../theme/font";
import colors from "../theme/colors";

const CustomModal = ({
  modalVisible,
  setModalVisible,
  idNote,
  theTagIsEditing,
  setTheTagIsEditing,
}) => {
  const navigation = useNavigation();
  const {
    tags,
    setTags,
    user,
    selectedNotes,
    setSelectedNotes,
    statusBarColor,
    setStatusBarColor,
  } = useContext(UserContext);
  const [activeLoading, setActiveLoading] = useState(false);

  useEffect(() => {
    if (modalVisible) {
      if (statusBarColor == colors.customBackgroundNoteRed) {
        setStatusBarColor("#af8c8c");
      } else if (statusBarColor == colors.customBackgroundNoteGreen) {
        setStatusBarColor("#8caf8c");
      } else if (statusBarColor == colors.customBackgroundNoteBlue) {
        setStatusBarColor("#8c8caf");
      } else if (statusBarColor == colors.backgroundLight) {
        setStatusBarColor("#acb09a");
      }
    } else {
      setStatusBarColor(colors.backgroundLight);
    }
  }, [modalVisible]);

  const delNote = async () => {
    setActiveLoading(true);
    if (selectedNotes.length !== 0) {
      for (let i = 0; i < selectedNotes.length; i++) {
        console.log(selectedNotes[i].title);
        await deleteDoc(doc(db, "notes", selectedNotes[i].id));
      }
      setModalVisible(false);
      setSelectedNotes([]);
      setActiveLoading(false);

      return;
    }

    await deleteDoc(doc(db, "notes", idNote))
      .then(() => console.log("deu certo"))
      .catch((error) => {
        console.log(error.message);
      });
    setActiveLoading(false);
    navigation.goBack();
  };

  const delTag = async () => {
    const item = theTagIsEditing;
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
    setModalVisible(false);
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
          backgroundColor: colors.backgroundColorBackModal,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          setModalVisible(!modalVisible);
        }}
        activeOpacity={1}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: fontSize.regular }}>Deseja excluir?</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 20,
            }}
          >
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ fontSize: fontSize.regular }}>nao</Text>
            </TouchableOpacity>
            {activeLoading ? (
              <Text>...</Text>
            ) : (
              <TouchableOpacity
                onPress={idNote || selectedNotes ? delNote : delTag}
              >
                <Text style={{ fontSize: fontSize.regular }}>sim</Text>
              </TouchableOpacity>
            )}
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
