import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConnection";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
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
  updateProfile,
} from "firebase/auth";
import ButtonCustom from "./ButtonCustom";

const windowWidth = Dimensions.get("window").width;

const CustomModal = ({
  modalVisible,
  setModalVisible,
  idNote,
  theTagIsEditing,
  setTheTagIsEditing,
  source,
  newName,
  newEmail,
  newPassword,
  checkVerifiedEmail,
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
      } else if (statusBarColor == colors.customBackgroundNoteOrange) {
        setStatusBarColor(colors.customStatusBarModalNoteOrange);
        configureNavigationBar(colors.customStatusBarModalNoteOrange);
      } else if (statusBarColor == colors.customBackgroundNoteYellow) {
        setStatusBarColor(colors.customStatusBarModalNoteYellow);
        configureNavigationBar(colors.customStatusBarModalNoteYellow);
      } else if (statusBarColor == colors.customBackgroundNoteGreen) {
        setStatusBarColor(colors.customStatusBarModalNoteGreen);
        configureNavigationBar(colors.customStatusBarModalNoteGreen);
      } else if (statusBarColor == colors.customBackgroundNoteBlue) {
        setStatusBarColor(colors.customStatusBarModalNoteBlue);
        configureNavigationBar(colors.customStatusBarModalNoteBlue);
      } else if (statusBarColor == colors.customBackgroundNoteIndigo) {
        setStatusBarColor(colors.customStatusBarModalNoteIndigo);
        configureNavigationBar(colors.customStatusBarModalNoteIndigo);
      } else if (statusBarColor == colors.customBackgroundNoteViolet) {
        setStatusBarColor(colors.customStatusBarModalNoteViolet);
        configureNavigationBar(colors.customStatusBarModalNoteViolet);
      } else if (statusBarColor == colors.backgroundLight) {
        setStatusBarColor(colors.backgroundLightStatusBarModal);
        configureNavigationBar(colors.backgroundLightStatusBarModal);
      }
    } else {
      if (statusBarColor == colors.customStatusBarModalNoteRed) {
        setStatusBarColor(colors.customBackgroundNoteRed);
        configureNavigationBar(colors.customBackgroundNoteRed);
      } else if (statusBarColor == colors.customStatusBarModalNoteOrange) {
        setStatusBarColor(colors.customBackgroundNoteOrange);
        configureNavigationBar(colors.customBackgroundNoteOrange);
      } else if (statusBarColor == colors.customStatusBarModalNoteYellow) {
        setStatusBarColor(colors.customBackgroundNoteYellow);
        configureNavigationBar(colors.customBackgroundNoteYellow);
      } else if (statusBarColor == colors.customStatusBarModalNoteGreen) {
        setStatusBarColor(colors.customBackgroundNoteGreen);
        configureNavigationBar(colors.customBackgroundNoteGreen);
      } else if (statusBarColor == colors.customStatusBarModalNoteBlue) {
        setStatusBarColor(colors.customBackgroundNoteBlue);
        configureNavigationBar(colors.customBackgroundNoteBlue);
      } else if (statusBarColor == colors.customStatusBarModalNoteIndigo) {
        setStatusBarColor(colors.customBackgroundNoteIndigo);
        configureNavigationBar(colors.customBackgroundNoteIndigo);
      } else if (statusBarColor == colors.customStatusBarModalNoteViolet) {
        setStatusBarColor(colors.customBackgroundNoteViolet);
        configureNavigationBar(colors.customBackgroundNoteViolet);
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

    setTheTagIsEditing(null);
    setModalVisible(false);
    setActiveLoading(false);
  };

  ("mateus.justino.07@gmail.com");
  ("mateus_justino_07@hotmail.com");
  const handleLogin = () => {
    if (password) {
      // Reautenticar o usuário antes de atualizar a senha
      // const credential = EmailAuthProvider.credential(
      //   auth.currentUser.email,
      //   password
      // );

      // reauthenticateWithCredential(auth.currentUser, credential)
      //   .then(() => {
      setActiveLoading(true);
      signInWithEmailAndPassword(auth, user.email, password)
        .then(() => {
          // substituir o signin pelo reauthenticate??????????
          // para mudar email
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
                setActiveLoading(false);
              })
              .catch((error) => {
                console.log(
                  `Código do erro: ${error.code}, Descrição: ${error.message}`
                );
                if (error.code === "auth/email-already-in-use") {
                  setModalAction("EmailAlreadyInUse");
                }
                setActiveLoading(false);
              });
          }
          // para mudar o password
          else if (modalAction === "AccountSettingsConfirmPassForPassword") {
            updatePassword(user, newPassword)
              .then(() => {
                console.log("password atualizado");
                setModalAction("AccountSettingsConfirmMessagePassword");
                setActiveLoading(false);
              })
              .catch((error) => {
                alert(error.message);
                setActiveLoading(false);
              });
          }
          // para mudar o name
          else if (modalAction === "AccountSettingsConfirmPassForName") {
            updateProfile(auth.currentUser, {
              displayName: newName,
            })
              .then(() => {
                setUser(auth.currentUser);
                setModalAction("AccountSettingsConfirmMessageName");
                setActiveLoading(false);
              })
              .catch((error) => {
                console.log("error updateProfile", error);
                setActiveLoading(false);
              });
          }
          // para mudar email e password
          else if (
            modalAction === "AccountSettingsConfirmPassForEmailAndPassword"
          ) {
            updatePassword(auth.currentUser, newPassword)
              .then(() => {
                console.log("passworddd atualizadooo");
              })
              .catch((error) => {
                console.log("updatePassword deu erro:");
                console.log(error.message);
              });

            setTimeout(() => {
              updateEmail(auth.currentUser, newEmail)
                .then(async () => {
                  console.log("email atualizadooo");
                  const userNow = auth.currentUser;
                  userNow.reload().then(() => {
                    setUser(userNow);
                  });

                  const settingsRef = doc(db, "settings", user.uid);
                  await updateDoc(settingsRef, {
                    LastTimeSendVerifiedEmail: null,
                  })
                    .then(() => console.log("updateDoc tudo certo"))
                    .catch((error) => {
                      console.log("updateDoc deu erro:");
                      console.log(error.message);
                    });
                  checkVerifiedEmail();
                  setActiveLoading(false);
                  setModalAction(
                    "AccountSettingsConfirmMessageEmailAndPassword"
                  );
                })
                .catch((error) => {
                  console.log("updateEmail deu erro:");
                  console.log(error.message);
                  if (error.code === "auth/email-already-in-use") {
                    setModalAction("EmailAlreadyInUse");
                  }
                  setActiveLoading(false);
                });
            }, 1000);
          }
          // para mudar email password e name
          else if (
            modalAction === "AccountSettingsConfirmPassForEmailPasswordAndName"
          ) {
            updateProfile(auth.currentUser, {
              displayName: newName,
            })
              .then(() => {
                setUser(auth.currentUser);
              })
              .catch((error) => {
                console.log("error updateProfile", error);
                setActiveLoading(false);
              });
            setTimeout(() => {
              updatePassword(auth.currentUser, newPassword)
                .then(() => {
                  console.log("updatePassword deu certo");
                })
                .catch((error) => {
                  console.log("updatePassword deu erro:");
                  console.log(error.message);
                  setActiveLoading(false);
                });
            }, 1000);

            setTimeout(() => {
              updateEmail(auth.currentUser, newEmail)
                .then(async () => {
                  console.log("email atualizadooo");
                  const userNow = auth.currentUser;
                  userNow.reload().then(() => {
                    setUser(userNow);
                  });

                  const settingsRef = doc(db, "settings", user.uid);
                  await updateDoc(settingsRef, {
                    LastTimeSendVerifiedEmail: null,
                  })
                    .then(() => console.log("updateDoc tudo certo"))
                    .catch((error) => {
                      console.log("updateDoc deu erro:");
                      console.log(error.message);
                    });
                  checkVerifiedEmail();
                  setModalAction(
                    "AccountSettingsConfirmMessageEmailPasswordAndName"
                  );
                  setActiveLoading(false);
                })
                .catch((error) => {
                  console.log("updateEmail deu erro:");
                  console.log(error.message);
                  if (error.code === "auth/email-already-in-use") {
                    setModalAction("EmailAlreadyInUse");
                  }
                  setActiveLoading(false);
                });
            }, 2000);
          }
          // para mudar email e name
          else if (
            modalAction === "AccountSettingsConfirmPassForEmailAndName"
          ) {
            updateProfile(auth.currentUser, {
              displayName: newName,
            })
              .then(() => {
                setUser(auth.currentUser);
              })
              .catch((error) => {
                console.log("error updateProfile", error);
              });
            setTimeout(() => {
              updateEmail(auth.currentUser, newEmail)
                .then(async () => {
                  console.log("email atualizadooo");
                  const userNow = auth.currentUser;
                  userNow.reload().then(() => {
                    setUser(userNow);
                  });
                  checkVerifiedEmail();
                  const settingsRef = doc(db, "settings", user.uid);
                  await updateDoc(settingsRef, {
                    LastTimeSendVerifiedEmail: null,
                  })
                    .then(() => {
                      setModalAction(
                        "AccountSettingsConfirmMessageEmailAndName"
                      );
                      setActiveLoading(false);
                      console.log("updateDoc tudo certo");
                    })
                    .catch((error) => {
                      console.log("updateDoc deu erro:");
                      console.log(error.message);
                      setActiveLoading(false);
                    });
                })
                .catch((error) => {
                  console.log("updateEmail deu erro:");
                  console.log(error.message);
                  if (error.code === "auth/email-already-in-use") {
                    setModalAction("EmailAlreadyInUse");
                  }
                  setActiveLoading(false);
                });
            }, 1000);
          }
          // para mudar  password e name
          else if (
            modalAction === "AccountSettingsConfirmPassForPasswordAndName"
          ) {
            updateProfile(auth.currentUser, {
              displayName: newName,
            })
              .then(() => {
                setUser(auth.currentUser);
              })
              .catch((error) => {
                console.log("error updateProfile", error);
              });

            setTimeout(() => {
              updatePassword(auth.currentUser, newPassword)
                .then(() => {
                  console.log("updatePassword deu certo");
                  setModalAction(
                    "AccountSettingsConfirmMessagePasswordAndName"
                  );
                  setActiveLoading(false);
                })
                .catch((error) => {
                  console.log("updatePassword deu erro:");
                  console.log(error.message);
                  setActiveLoading(false);
                });
            }, 1000);
          }
        })
        .catch((error) => {
          console.log("signInWithEmailAndPassword erro:", error.message);
        });
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

  const InputPassword = ({ message }) => {
    return (
      <View>
        <Text
          style={{
            fontSize: fontSize.regular,
            fontFamily: fontFamily.PoppinsSemiBold600,
          }}
        >
          {message}
        </Text>

        <TextInputCustom
          label="Password"
          text={password}
          setText={setPassword}
          // placeholder="Enter password..."
        />
      </View>
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
          {modalAction === "AccountSettingsInvalidEmail" && (
            <TitleMsg message="Email invalido" />
          )}
          {modalAction === "AccountSettingsConfirmMessageEmailAndPassword" && (
            <TitleMsg message="Email e Password alterado!" />
          )}
          {modalAction === "AccountSettingsPasswordShort" && (
            <TitleMsg message="Password muito curto" />
          )}
          {modalAction === "AccountSettingsPasswordConfirmDifferent" && (
            <TitleMsg message="ConfirmPassword diferente" />
          )}
          {modalAction === "AccountSettingsConfirmMessageName" && (
            <TitleMsg message="name alterado!" />
          )}
          {modalAction ===
            "AccountSettingsConfirmMessageEmailPasswordAndName" && (
            <TitleMsg message="name email e password alterado!" />
          )}
          {modalAction === "AccountSettingsEmptyName" && (
            <TitleMsg message="name vazio!" />
          )}
          {modalAction === "AccountSettingsConfirmMessageEmailAndName" && (
            <TitleMsg message="name e email alterado!" />
          )}
          {modalAction === "AccountSettingsConfirmMessagePasswordAndName" && (
            <TitleMsg message="name e password alterado!" />
          )}
          {modalAction === "EmailAlreadyInUse" && (
            <TitleMsg message="Email ja esta sendo utilizado!" />
          )}
          {modalAction === "RequireAllFields" && (
            <TitleMsg message="Preencha todos os campos!" />
          )}

          {/* --------------parte dos input-------------  */}
          {modalAction === "AccountSettingsConfirmPassForName" && (
            <InputPassword message="Confirme sua senha antes de alterar seu name" />
          )}
          {modalAction === "AccountSettingsConfirmPassForEmail" && (
            <InputPassword message="Confirme sua senha antes de alterar seu email" />
          )}
          {modalAction === "AccountSettingsConfirmPassForPassword" && (
            <InputPassword message="Confirme sua senha antes de alterar seu password" />
          )}
          {modalAction === "AccountSettingsConfirmPassForEmailAndPassword" && (
            <InputPassword message="Confirme sua senha antes de alterar seu email e password" />
          )}
          {modalAction ===
            "AccountSettingsConfirmPassForEmailPasswordAndName" && (
            <InputPassword message="Confirme sua senha antes de alterar seu email e password e name" />
          )}
          {modalAction === "AccountSettingsConfirmPassForEmailAndName" && (
            <InputPassword message="Confirme sua senha antes de alterar seu email e name" />
          )}
          {modalAction === "AccountSettingsConfirmPassForPasswordAndName" && (
            <InputPassword message="Confirme sua senha antes de alterar seu password e name" />
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
              <View style={{ width: 50 }}>
                <ButtonCustom
                  onPressFunc={() => setModalVisible(false)}
                  border
                  title="No"
                  txtColor={colors.primaryPurple}
                />
              </View>
              // <TouchableOpacity
              //   onPress={() => setModalVisible(false)}
              //   style={[
              //     styles.button,
              //     { borderWidth: 1, borderColor: colors.borderColorLight },
              //   ]}
              // >
              //   <Text
              //     style={{
              //       fontSize: fontSize.regular,
              //       fontFamily: fontFamily.PoppinsRegular400,
              //     }}
              //   >
              //     No
              //   </Text>
              // </TouchableOpacity>
            )}

            <View style={{ width: 50 }}>
              <ButtonCustom
                onPressFunc={() => {
                  if (source === "Home" || source === "EditNote") {
                    delNote();
                  } else if (source === "SettingsTags") {
                    delTag();
                  } else if (
                    modalAction === "AccountSettingsConfirmPassForEmail" ||
                    modalAction === "AccountSettingsConfirmPassForPassword" ||
                    modalAction ===
                      "AccountSettingsConfirmPassForEmailAndPassword" ||
                    modalAction ===
                      "AccountSettingsConfirmPassForEmailPasswordAndName" ||
                    modalAction ===
                      "AccountSettingsConfirmPassForEmailAndName" ||
                    modalAction ===
                      "AccountSettingsConfirmPassForPasswordAndName" ||
                    modalAction === "AccountSettingsConfirmPassForName"
                  ) {
                    handleLogin();
                  } else {
                    setModalVisible(false);
                  }
                }}
                title={modalAction ? "Ok" : "Yes"}
                background={
                  modalAction ? colors.primaryPurple : colors.buttonRed
                }
                active={activeLoading}
                txtColor={colors.backgroundLight}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  button: {
    padding: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
