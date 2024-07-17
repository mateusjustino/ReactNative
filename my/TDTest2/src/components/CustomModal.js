import { Text, View, Modal, TouchableOpacity, Dimensions } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConnection";
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
import TextInputCustom from "./TextInputCustom";
import {
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
} from "firebase/auth";

const windowWidth = Dimensions.get("window").width;

const CustomModal = ({
  modalVisible,
  setModalVisible,
  idNote,
  theTagIsEditing,
  setTheTagIsEditing,
  source,
  newEmail,
  newPassword,
  checkVerifiedEmail,
  setSource,
}) => {
  const navigation = useNavigation();
  const {
    tags,
    setTags,
    user,
    setUser,
    selectedNotes,
    setSelectedNotes,
    statusBarColor,
    setStatusBarColor,
    modalAction,
    setModalAction,
  } = useContext(UserContext);
  const [activeLoading, setActiveLoading] = useState(false);
  const [password, setPassword] = useState("123123");

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

    const settingsRef = doc(db, "settings", user.uid);
    await updateDoc(settingsRef, {
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

    // await setDoc(doc(db, "settings", user.uid), {
    //   tags: list,
    // }).then(async () => {
    //   const q = query(collection(db, "notes"));
    //   const querySnapshot = await getDocs(q);
    //   querySnapshot.forEach(async (document) => {
    //     if (user.uid === document.data().uid) {
    //       let listTags = document.data().tags;
    //       const indexItem = listTags.indexOf(item);
    //       if (indexItem !== -1) {
    //         listTags.splice(indexItem, 1);
    //         const ref = doc(db, "notes", document.id);
    //         await updateDoc(ref, {
    //           tags: listTags,
    //         })
    //           .then(() => console.log("tudo certo"))
    //           .catch((error) => console.log(error.message));
    //       }
    //     }
    //   });
    // });

    setTheTagIsEditing(null);
    setModalVisible(false);
    setActiveLoading(false);
  };

  ("mateus.justino.07@gmail.com");
  ("mateus_justino_07@hotmail.com");
  const handleLogin = () => {
    if (password) {
      signInWithEmailAndPassword(auth, user.email, password)
        .then(() => {
          if (modalAction === "AccountSettingsConfirmPassForEmail") {
            updateEmail(auth.currentUser, newEmail)
              .then(async () => {
                const userNow = auth.currentUser;
                userNow.reload().then(() => {
                  setUser(userNow);
                });
                checkVerifiedEmail();
                setModalAction("AccountSettingsConfirmMessageEmail");
                const settingsRef = doc(db, "settings", user.uid);
                await updateDoc(settingsRef, {
                  LastTimeSendVerifiedEmail: null,
                });
              })
              .catch((error) => {
                alert(error.message);
              });
          } else if (modalAction === "AccountSettingsConfirmPassForPassword") {
            updatePassword(user, newPassword)
              .then(() => {
                console.log("password atualizado");
                setModalAction("AccountSettingsConfirmMessagePassword");
              })
              .catch((error) => {
                alert(error.code);
              });
          }
        })
        .catch((error) => {});
    }
  };

  const TitleMsg = ({ message }) => {
    return (
      <Text
        style={{
          fontSize: fontSize.regular,
          fontFamily: fontFamily.PoppinsSemiBold600,
        }}
      >
        {message}
      </Text>
    );
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
            borderWidth: 1,
            borderColor: colors.borderColorLight,
            width: windowWidth > 400 ? 400 : "90%",
          }}
        >
          {source === "Home" && (
            <TitleMsg message="Deseja excluir as notas selecionadas?" />
          )}
          {source === "EditNote" && (
            <TitleMsg message="Deseja excluir esta nota?" />
          )}
          {source === "SettingsTags" && (
            <TitleMsg message="Deseja excluir esta tag?" />
          )}
          {modalAction === "AccountSettingsConfirmMessageEmail" && (
            <TitleMsg message="Email alterado!" />
          )}
          {modalAction === "AccountSettingsSendEmail" && (
            <TitleMsg message="Email enviado, confirme ele!" />
          )}
          {modalAction === "AccountSettingsVerifyEmail" && (
            <TitleMsg message="Antes de alterar é necessario verificar seu email" />
          )}
          {modalAction === "AccountSettingsTooManyRequests" && (
            <TitleMsg message="Email já enviado para o destinatario, aguarde para solicitar outro" />
          )}
          {modalAction === "AccountSettingsConfirmMessagePassword" && (
            <TitleMsg message="Password alterado!" />
          )}

          {modalAction === "AccountSettingsConfirmPassForEmail" && (
            <View>
              <Text
                style={{
                  fontSize: fontSize.regular,
                  fontFamily: fontFamily.PoppinsSemiBold600,
                }}
              >
                Confirme sua senha antes das alterações
              </Text>

              <TextInputCustom
                label="Password"
                text={password}
                setText={setPassword}
                placeholder="enter"
              />
            </View>
          )}
          {modalAction === "AccountSettingsConfirmPassForPassword" && (
            <View>
              <Text
                style={{
                  fontSize: fontSize.regular,
                  fontFamily: fontFamily.PoppinsSemiBold600,
                }}
              >
                Confirme sua senha antes das alterações
              </Text>

              <TextInputCustom
                label="Password"
                text={password}
                setText={setPassword}
                placeholder="enter"
              />
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 20,
            }}
          >
            {!modalAction && (
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
            )}

            {activeLoading ? (
              <Text>...</Text>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (source === "Home" || source === "EditNote") {
                    delNote();
                  } else if (source === "SettingsTags") {
                    delTag();
                  } else if (
                    modalAction === "AccountSettingsConfirmPassForEmail" ||
                    modalAction === "AccountSettingsConfirmPassForPassword"
                  ) {
                    handleLogin();
                  } else {
                    setModalVisible(false);
                  }
                  // if (modalAction === "AccountSettingsConfirmMessageEmail") {
                  //   setModalVisible(false);
                  // }
                  // if (modalAction === "AccountSettingsSendEmail") {
                  //   setModalVisible(false);
                  // }
                }}
                style={{
                  padding: 5,
                  borderRadius: 10,
                  backgroundColor: modalAction ? colors.primaryBlue : "#ff313b",
                }}
              >
                <Text
                  style={{
                    fontSize: fontSize.regular,
                    color: colors.backgroundLight,
                    fontFamily: fontFamily.PoppinsRegular400,
                  }}
                >
                  {modalAction ? "Ok" : "Yes"}
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
