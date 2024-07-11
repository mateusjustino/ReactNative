import { Text, View, Modal, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebaseConnection";
import {
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
import { fontFamily, fontSize } from "../theme/font";
import colors from "../theme/colors";
import { configureNavigationBar } from "../scripts/NavigationBar";

const CustomModal = ({
  modalVisible,
  setModalVisible,
  idNote,
  theTagIsEditing,
  setTheTagIsEditing,
  source,
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
        setStatusBarColor(colors.customStatusBarModalNoteRed);
        configureNavigationBar(colors.customStatusBarModalNoteRed);
      } else if (statusBarColor == colors.customBackgroundNoteGreen) {
        setStatusBarColor(colors.customStatusBarModalNoteGreen);
        configureNavigationBar(colors.customStatusBarModalNoteGreen);
      } else if (statusBarColor == colors.customBackgroundNoteBlue) {
        setStatusBarColor(colors.customStatusBarModalNoteBlue);
        configureNavigationBar(colors.customStatusBarModalNoteBlue);
      } else if (statusBarColor == colors.backgroundLight) {
        setStatusBarColor(colors.backgroundLightStatusBarModal);
        configureNavigationBar(colors.backgroundLightStatusBarModal);
      }
    } else {
      if (statusBarColor == colors.customStatusBarModalNoteRed) {
        setStatusBarColor(colors.customBackgroundNoteRed);
        configureNavigationBar(colors.customBackgroundNoteRed);
      } else if (statusBarColor == colors.customStatusBarModalNoteGreen) {
        setStatusBarColor(colors.customBackgroundNoteGreen);
        configureNavigationBar(colors.customBackgroundNoteGreen);
      } else if (statusBarColor == colors.customStatusBarModalNoteBlue) {
        setStatusBarColor(colors.customBackgroundNoteBlue);
        configureNavigationBar(colors.customBackgroundNoteBlue);
      } else if (statusBarColor == colors.backgroundLightStatusBarModal) {
        setStatusBarColor(colors.backgroundLight);
        configureNavigationBar(colors.backgroundLight);
      }
    }
  }, [modalVisible]);

  const delNote = async () => {
    setActiveLoading(true);
    if (selectedNotes.length !== 0) {
      for (let i = 0; i < selectedNotes.length; i++) {
        console.log(selectedNotes[i].title);
        await deleteDoc(doc(db, "notes", selectedNotes[i].id));
      }
      setSelectedNotes([]);
    } else {
      await deleteDoc(doc(db, "notes", idNote))
        .then(() => {})
        .catch((error) => {
          console.log(error.message);
        });
      navigation.goBack();
    }
    setModalVisible(false);
    setActiveLoading(false);
  };

  const delTag = async () => {
    setActiveLoading(true);
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
    setActiveLoading(false);
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
            backgroundColor: colors.backgroundLight,
            padding: 20,
            borderRadius: 10,
            width: 280,
            borderWidth: 1,
            borderColor: colors.borderColorLight,
          }}
        >
          <Text
            style={{
              fontSize: fontSize.regular,
              fontFamily: fontFamily.PoppinsSemiBold600,
            }}
          >
            {source === "Home" && "Deseja excluir as notas selecionadas?"}
            {source === "EditNote" && "Deseja excluir esta nota?"}
            {source === "SettingsTags" && "Deseja excluir esta tag?"}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                padding: 5,
              }}
            >
              <Text
                style={{
                  fontSize: fontSize.regular,
                  fontFamily: fontFamily.PoppinsRegular400,
                }}
              >
                No
              </Text>
            </TouchableOpacity>
            {activeLoading ? (
              <Text>...</Text>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (source === "Home" || source === "EditNote") {
                    delNote();
                  }
                  if (source === "SettingsTags") {
                    delTag();
                  }
                  // idNote || selectedNotes.length !== 0 ? delNote : delTag
                }}
                style={{
                  padding: 5,
                  borderRadius: 10,
                  backgroundColor: "#ff313b",
                }}
              >
                <Text
                  style={{
                    fontSize: fontSize.regular,
                    color: "white",
                    fontFamily: fontFamily.PoppinsRegular400,
                  }}
                >
                  Yes
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default CustomModal;
