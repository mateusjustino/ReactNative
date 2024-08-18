import { Text, View, Modal, TouchableOpacity, StyleSheet } from "react-native";
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
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import ButtonCustom from "./ButtonCustom";
import { Ionicons } from "@expo/vector-icons";
import { iconSize } from "../theme/icon";

const CustomModal = ({
  modalVisible,
  setModalVisible,
  idNote,
  theTagIsEditing,
  setTheTagIsEditing,
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
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    if (!modalVisible) {
      setModalAction("");
      setActiveLoading(false);
      setPassword("");
      setEmail("");
      setShowPassword(false);
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

    const docRef = doc(db, "userData", user.uid);
    await updateDoc(docRef, {
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

  const handleLogin = () => {
    if (password) {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );

      reauthenticateWithCredential(auth.currentUser, credential)
        .then(() => {
          setActiveLoading(true);
          if (modalAction === "AccountSettingsConfirmPassForEmail") {
            updateEmail(auth.currentUser, newEmail)
              .then(async () => {
                const userNow = auth.currentUser;
                userNow.reload().then(() => {
                  setUser(userNow);
                });
                checkVerifiedEmail();
                setModalAction("AccountSettingsConfirmMessageEmail");
                const docRef = doc(db, "userData", user.uid);
                await updateDoc(docRef, {
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
          } else if (modalAction === "AccountSettingsConfirmPassForPassword") {
            updatePassword(user, newPassword)
              .then(() => {
                setModalAction("AccountSettingsConfirmMessagePassword");
                setActiveLoading(false);
              })
              .catch((error) => {
                alert(error.message);
                setActiveLoading(false);
              });
          } else if (modalAction === "AccountSettingsConfirmPassForName") {
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
          } else if (
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

                  const docRef = doc(db, "userData", user.uid);
                  await updateDoc(docRef, {
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
          } else if (
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

                  const docRef = doc(db, "userData", user.uid);
                  await updateDoc(docRef, {
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
          } else if (
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
                  const docRef = doc(db, "userData", user.uid);
                  await updateDoc(docRef, {
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
          } else if (
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
          console.log("reauthenticateWithCredential erro:", error.message);
          if (error.code === "auth/wrong-password") {
            setModalAction("WrongPassword");
            setModalVisible(true);
          }
        });
    }
  };

  const sendResetPassword = () => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const checkEmail = re.test(String(email).toLowerCase());
    if (checkEmail) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          setModalAction("ConfirmeMessageForEmailForSendPasswordReset");
        })
        .catch((error) => {
          console.log(error.code);
          console.log(error.message);
          if (error.code === "auth/user-not-found") {
            setModalAction("UserNotFound");
          }
        });
    } else {
      setModalAction("AccountSettingsInvalidEmail");
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

  const IconShowPass = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingHorizontal: 5,
          alignItems: "center",
        }}
      >
        {showPassword ? (
          <TouchableOpacity
            onPress={() => setShowPassword(false)}
            activeOpacity={0.5}
          >
            <Ionicons
              name="eye-outline"
              size={iconSize.regular}
              color={colors.primaryPurple}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setShowPassword(true)}>
            <Ionicons
              name="eye-off-outline"
              size={iconSize.regular}
              color={colors.primaryPurple}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const ButtonNo = () => {
    return (
      <View style={{ width: 50 }}>
        <ButtonCustom
          onPressFunc={() => setModalVisible(false)}
          border
          title="No"
          txtColor={colors.primaryPurple}
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
            width: "90%",
            maxWidth: 400,
          }}
        >
          {modalAction === "Home" && (
            <TitleMsg message="Deseja excluir as notas selecionadas?" />
          )}
          {modalAction === "EditNote" && (
            <TitleMsg message="Deseja excluir esta nota?" />
          )}
          {modalAction === "SettingsTags" && (
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
          {modalAction === "UserNotFound" && (
            <TitleMsg message="Usuario nao encontrado" />
          )}
          {modalAction === "WrongPassword" && (
            <TitleMsg message="Password errado" />
          )}
          {modalAction === "TooManyRequests" && (
            <TitleMsg message="muitas tentativas erradas, tente mais tarde" />
          )}
          {modalAction === "ConfirmeMessageForEmailForSendPasswordReset" && (
            <TitleMsg message="email de reset pass enviado" />
          )}
          {modalAction === "TagAlreadyExist" && (
            <TitleMsg message="Tag ja existe" />
          )}

          {/* parte dos input */}

          {modalAction === "AccountSettingsConfirmPassForName" && (
            <TextInputCustom
              label="Confirme sua senha antes de alterar seu name"
              text={password}
              setText={setPassword}
              forModal
              secure={!showPassword}
            />
          )}
          {modalAction === "AccountSettingsConfirmPassForEmail" && (
            <TextInputCustom
              label="Confirme sua senha antes de alterar seu email"
              text={password}
              setText={setPassword}
              forModal
              secure={!showPassword}
            />
          )}
          {modalAction === "AccountSettingsConfirmPassForPassword" && (
            <TextInputCustom
              label="Confirme sua senha antes de alterar seu password"
              text={password}
              setText={setPassword}
              forModal
              secure={!showPassword}
            />
          )}
          {modalAction === "AccountSettingsConfirmPassForEmailAndPassword" && (
            <TextInputCustom
              label="Confirme sua senha antes de alterar seu email e password"
              text={password}
              setText={setPassword}
              forModal
              secure={!showPassword}
            />
          )}
          {modalAction ===
            "AccountSettingsConfirmPassForEmailPasswordAndName" && (
            <TextInputCustom
              label="Confirme sua senha antes de alterar seu email e password e name"
              text={password}
              setText={setPassword}
              forModal
              secure={!showPassword}
            />
          )}
          {modalAction === "AccountSettingsConfirmPassForEmailAndName" && (
            <TextInputCustom
              label="Confirme sua senha antes de alterar seu email e name"
              text={password}
              setText={setPassword}
              forModal
              secure={!showPassword}
            />
          )}
          {modalAction === "AccountSettingsConfirmPassForPasswordAndName" && (
            <TextInputCustom
              label="Confirme sua senha antes de alterar seu password e name"
              text={password}
              setText={setPassword}
              forModal
              secure={!showPassword}
            />
          )}
          {modalAction === "ConfirmEmailForSendPasswordReset" && (
            <TextInputCustom
              label="Insira seu email para recuperar"
              text={email}
              setText={setEmail}
              forModal
              inputMode="email"
              autoCapitalize="none"
            />
          )}

          {/* parte do show password */}

          {modalAction === "AccountSettingsConfirmPassForName" && (
            <IconShowPass />
          )}
          {modalAction === "AccountSettingsConfirmPassForEmail" && (
            <IconShowPass />
          )}
          {modalAction === "AccountSettingsConfirmPassForPassword" && (
            <IconShowPass />
          )}
          {modalAction === "AccountSettingsConfirmPassForEmailAndPassword" && (
            <IconShowPass />
          )}
          {modalAction ===
            "AccountSettingsConfirmPassForEmailPasswordAndName" && (
            <IconShowPass />
          )}
          {modalAction === "AccountSettingsConfirmPassForEmailAndName" && (
            <IconShowPass />
          )}
          {modalAction === "AccountSettingsConfirmPassForPasswordAndName" && (
            <IconShowPass />
          )}

          <View style={styles.buttonContainer}>
            {modalAction === "Home" && <ButtonNo />}
            {modalAction === "EditNote" && <ButtonNo />}
            {modalAction === "SettingsTags" && <ButtonNo />}

            <View style={{ width: 50 }}>
              <ButtonCustom
                onPressFunc={() => {
                  if (modalAction === "Home" || modalAction === "EditNote") {
                    delNote();
                  } else if (modalAction === "SettingsTags") {
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
                  } else if (
                    modalAction === "ConfirmEmailForSendPasswordReset"
                  ) {
                    sendResetPassword();
                  } else {
                    setModalVisible(false);
                  }
                }}
                title={
                  modalAction === "Home" ||
                  modalAction === "EditNote" ||
                  modalAction === "SettingsTags"
                    ? "Yes"
                    : "Ok"
                }
                background={
                  modalAction === "Home" ||
                  modalAction === "EditNote" ||
                  modalAction === "SettingsTags"
                    ? colors.buttonRed
                    : colors.primaryPurple
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
});
