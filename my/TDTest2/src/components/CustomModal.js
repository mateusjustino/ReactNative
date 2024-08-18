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
import configureNavigationBar from "../scripts/configureNavigationBar";
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
import getUnknownErrorFirebase from "../scripts/getUnknownErrorFirebase";

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
        await deleteDoc(doc(db, "notes", selectedNotes[i].id)).catch(
          (error) => {
            getUnknownErrorFirebase(
              "CustomModal",
              "delNote/deleteDoc",
              error.code,
              error.message
            );
            setModalAction("UnknownError");
            setActiveLoading(false);
            return;
          }
        );
      }
      setSelectedNotes([]);
    } else {
      await deleteDoc(doc(db, "notes", idNote)).catch((error) => {
        getUnknownErrorFirebase(
          "CustomModal",
          "delNote/deleteDoc",
          error.code,
          error.message
        );
        setModalAction("UnknownError");
        setActiveLoading(false);
        return;
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
    })
      .then(async () => {
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
              }).catch((error) => {
                getUnknownErrorFirebase(
                  "CustomModal",
                  "delTag/updateDoc/second",
                  error.code,
                  error.message
                );
                setModalAction("UnknownError");
                setActiveLoading(false);
                setTheTagIsEditing(null);
                return;
              });
            }
          }
        });
      })
      .catch((error) => {
        getUnknownErrorFirebase(
          "CustomModal",
          "delTag/updateDoc/first",
          error.code,
          error.message
        );
        setModalAction("UnknownError");
        setActiveLoading(false);
        setTheTagIsEditing(null);
        return;
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

      // mateus.justino.07@gmail.com
      // mateus_justino_07@hotmail.com
      reauthenticateWithCredential(auth.currentUser, credential)
        .then(() => {
          setActiveLoading(true);
          if (modalAction === "ConfirmPassForEmail") {
            updateEmail(auth.currentUser, newEmail)
              .then(async () => {
                const userNow = auth.currentUser;
                userNow.reload().then(() => {
                  setUser(userNow);
                });
                checkVerifiedEmail();
                setModalAction("ChangedEmail");
                setActiveLoading(false);
                const docRef = doc(db, "userData", user.uid);
                await updateDoc(docRef, {
                  LastTimeSendVerifiedEmail: null,
                }).catch((error) => {
                  if (error.code === "auth/email-already-in-use") {
                    setModalAction("EmailAlreadyInUse");
                  } else {
                    getUnknownErrorFirebase(
                      "CustomModal",
                      "handleLogin/updateDoc/ChangedEmail",
                      error.code,
                      error.message
                    );
                    setModalAction("UnknownError");
                  }
                });
              })
              .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                  setModalAction("EmailAlreadyInUse");
                } else {
                  getUnknownErrorFirebase(
                    "CustomModal",
                    "handleLogin/updateEmail/ConfirmPassForEmail",
                    error.code,
                    error.message
                  );
                  setModalAction("UnknownError");
                }
                setActiveLoading(false);
              });
          } else if (modalAction === "ConfirmPassForPassword") {
            updatePassword(user, newPassword)
              .then(() => {
                setModalAction("ChangedPassword");
                setActiveLoading(false);
              })
              .catch((error) => {
                getUnknownErrorFirebase(
                  "CustomModal",
                  "handleLogin/updatePassword/ConfirmPassForPassword",
                  error.code,
                  error.message
                );
                setModalAction("UnknownError");
                setActiveLoading(false);
              });
          } else if (modalAction === "ConfirmPassForName") {
            updateProfile(auth.currentUser, {
              displayName: newName,
            })
              .then(() => {
                setUser(auth.currentUser);
                setModalAction("ChangedName");
                setActiveLoading(false);
              })
              .catch((error) => {
                getUnknownErrorFirebase(
                  "CustomModal",
                  "handleLogin/updateProfile/ConfirmPassForName",
                  error.code,
                  error.message
                );
                setModalAction("UnknownError");
                setActiveLoading(false);
              });
          } else if (modalAction === "ConfirmPassForEmailPassword") {
            updatePassword(auth.currentUser, newPassword).catch((error) => {
              getUnknownErrorFirebase(
                "CustomModal",
                "handleLogin/updatePassword/ConfirmPassForEmailPassword",
                error.code,
                error.message
              );
              setModalAction("UnknownError");
            });

            setTimeout(() => {
              updateEmail(auth.currentUser, newEmail)
                .then(async () => {
                  const userNow = auth.currentUser;
                  userNow.reload().then(() => {
                    setUser(userNow);
                  });

                  const docRef = doc(db, "userData", user.uid);
                  await updateDoc(docRef, {
                    LastTimeSendVerifiedEmail: null,
                  }).catch((error) => {
                    getUnknownErrorFirebase(
                      "CustomModal",
                      "handleLogin/updateDoc/ConfirmPassForEmailPassword",
                      error.code,
                      error.message
                    );
                    setModalAction("UnknownError");
                  });
                  checkVerifiedEmail();
                  setActiveLoading(false);
                  setModalAction("ChangedEmailPassword");
                })
                .catch((error) => {
                  if (error.code === "auth/email-already-in-use") {
                    setModalAction("EmailAlreadyInUse");
                  } else {
                    getUnknownErrorFirebase(
                      "CustomModal",
                      "handleLogin/updateEmail/ConfirmPassForEmailPassword",
                      error.code,
                      error.message
                    );
                    setModalAction("UnknownError");
                  }
                  setActiveLoading(false);
                });
            }, 1000);
          } else if (modalAction === "ConfirmPassForEmailPasswordName") {
            updateProfile(auth.currentUser, {
              displayName: newName,
            })
              .then(() => {
                setUser(auth.currentUser);
              })
              .catch((error) => {
                getUnknownErrorFirebase(
                  "CustomModal",
                  "handleLogin/updateProfile/ConfirmPassForEmailPasswordName",
                  error.code,
                  error.message
                );
                setModalAction("UnknownError");
                setActiveLoading(false);
              });
            setTimeout(() => {
              updatePassword(auth.currentUser, newPassword).catch((error) => {
                getUnknownErrorFirebase(
                  "CustomModal",
                  "handleLogin/updatePassword/ConfirmPassForEmailPasswordName",
                  error.code,
                  error.message
                );
                setModalAction("UnknownError");
                setActiveLoading(false);
              });
            }, 1000);

            setTimeout(() => {
              updateEmail(auth.currentUser, newEmail)
                .then(async () => {
                  const userNow = auth.currentUser;
                  userNow.reload().then(() => {
                    setUser(userNow);
                  });

                  const docRef = doc(db, "userData", user.uid);
                  await updateDoc(docRef, {
                    LastTimeSendVerifiedEmail: null,
                  }).catch((error) => {
                    getUnknownErrorFirebase(
                      "CustomModal",
                      "handleLogin/updateDoc/ConfirmPassForEmailPasswordName",
                      error.code,
                      error.message
                    );
                    setModalAction("UnknownError");
                  });
                  checkVerifiedEmail();
                  setModalAction("ChangedEmailPasswordName");
                  setActiveLoading(false);
                })
                .catch((error) => {
                  if (error.code === "auth/email-already-in-use") {
                    setModalAction("EmailAlreadyInUse");
                  } else {
                    getUnknownErrorFirebase(
                      "CustomModal",
                      "handleLogin/updateEmail/ConfirmPassForEmailPasswordName",
                      error.code,
                      error.message
                    );
                    setModalAction("UnknownError");
                  }
                  setActiveLoading(false);
                });
            }, 2000);
          } else if (modalAction === "ConfirmPassForEmailName") {
            updateProfile(auth.currentUser, {
              displayName: newName,
            })
              .then(() => {
                setUser(auth.currentUser);
              })
              .catch((error) => {
                getUnknownErrorFirebase(
                  "CustomModal",
                  "handleLogin/updateProfile/ConfirmPassForEmailName",
                  error.code,
                  error.message
                );
                setModalAction("UnknownError");
              });
            setTimeout(() => {
              updateEmail(auth.currentUser, newEmail)
                .then(async () => {
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
                      setModalAction("ChangedEmailName");
                      setActiveLoading(false);
                    })
                    .catch((error) => {
                      getUnknownErrorFirebase(
                        "CustomModal",
                        "handleLogin/updateDoc/ConfirmPassForEmailName",
                        error.code,
                        error.message
                      );
                      setModalAction("UnknownError");
                      setActiveLoading(false);
                    });
                })
                .catch((error) => {
                  if (error.code === "auth/email-already-in-use") {
                    setModalAction("EmailAlreadyInUse");
                  } else {
                    getUnknownErrorFirebase(
                      "CustomModal",
                      "handleLogin/updateEmail/ConfirmPassForEmailName",
                      error.code,
                      error.message
                    );
                    setModalAction("UnknownError");
                  }
                  setActiveLoading(false);
                });
            }, 1000);
          } else if (modalAction === "ConfirmPassForPasswordName") {
            updateProfile(auth.currentUser, {
              displayName: newName,
            })
              .then(() => {
                setUser(auth.currentUser);
              })
              .catch((error) => {
                getUnknownErrorFirebase(
                  "CustomModal",
                  "handleLogin/updateProfile/ConfirmPassForPasswordName",
                  error.code,
                  error.message
                );
                setModalAction("UnknownError");
              });

            setTimeout(() => {
              updatePassword(auth.currentUser, newPassword)
                .then(() => {
                  setModalAction("ChangedPasswordName");
                  setActiveLoading(false);
                })
                .catch((error) => {
                  getUnknownErrorFirebase(
                    "CustomModal",
                    "handleLogin/updatePassword/ConfirmPassForPasswordName",
                    error.code,
                    error.message
                  );
                  setModalAction("UnknownError");
                  setActiveLoading(false);
                });
            }, 1000);
          }
        })
        .catch((error) => {
          if (error.code === "auth/wrong-password") {
            setModalAction("WrongPassword");
          } else {
            getUnknownErrorFirebase(
              "CustomModal",
              "handleLogin/reauthenticateWithCredential",
              error.code,
              error.message
            );
            setModalAction("UnknownError");
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
          setModalAction("SendPasswordReset");
        })
        .catch((error) => {
          if (error.code === "auth/user-not-found") {
            setModalAction("UserNotFound");
          } else {
            getUnknownErrorFirebase(
              "CustomModal",
              "sendResetPassword/sendPasswordResetEmail",
              error.code,
              error.message
            );
            setModalAction("UnknownError");
          }
        });
    } else {
      setModalAction("InvalidEmail");
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
      <View style={{ flex: 1 }}>
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
          {modalAction === "DelSelectedNotes" && (
            <TitleMsg message="Deseja excluir as notas selecionadas?" />
          )}
          {modalAction === "DelNote" && (
            <TitleMsg message="Deseja excluir esta nota?" />
          )}
          {modalAction === "DelTag" && (
            <TitleMsg message="Deseja excluir esta tag?" />
          )}
          {modalAction === "ChangedEmail" && (
            <TitleMsg message="Email alterado!" />
          )}
          {modalAction === "SendEmail" && (
            <TitleMsg message="Email enviado, confirme ele!" />
          )}
          {modalAction === "NeedVerifyEmail" && (
            <TitleMsg message="Antes de alterar é necessario verificar seu email" />
          )}
          {modalAction === "TooManyRequests" && (
            <TitleMsg message="Email já enviado para o destinatario, aguarde para solicitar outro" />
          )}
          {modalAction === "ChangedPassword" && (
            <TitleMsg message="Password alterado!" />
          )}
          {modalAction === "InvalidEmail" && (
            <TitleMsg message="Email invalido" />
          )}
          {modalAction === "ChangedEmailPassword" && (
            <TitleMsg message="Email e Password alterado!" />
          )}
          {modalAction === "ShortPassword" && (
            <TitleMsg message="Password muito curto" />
          )}
          {modalAction === "DifferentPassword" && (
            <TitleMsg message="ConfirmPassword diferente" />
          )}
          {modalAction === "ChangedName" && (
            <TitleMsg message="name alterado!" />
          )}
          {modalAction === "ChangedEmailPasswordName" && (
            <TitleMsg message="name email e password alterado!" />
          )}
          {modalAction === "EmptyName" && <TitleMsg message="name vazio!" />}
          {modalAction === "ChangedEmailName" && (
            <TitleMsg message="name e email alterado!" />
          )}
          {modalAction === "ChangedPasswordName" && (
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
          {modalAction === "SendPasswordReset" && (
            <TitleMsg message="email de reset pass enviado" />
          )}
          {modalAction === "TagAlreadyExist" && (
            <TitleMsg message="Tag ja existe" />
          )}
          {modalAction === "UnknownError" && (
            <TitleMsg message="Unknown error, we are working in a solution" />
          )}

          {/* parte dos input */}

          {modalAction === "ConfirmPassForName" && (
            <TextInputCustom
              label="Confirme sua senha antes de alterar seu name"
              text={password}
              setText={setPassword}
              forModal
              secure={!showPassword}
            />
          )}
          {modalAction === "ConfirmPassForEmail" && (
            <TextInputCustom
              label="Confirme sua senha antes de alterar seu email"
              text={password}
              setText={setPassword}
              forModal
              secure={!showPassword}
            />
          )}
          {modalAction === "ConfirmPassForPassword" && (
            <TextInputCustom
              label="Confirme sua senha antes de alterar seu password"
              text={password}
              setText={setPassword}
              forModal
              secure={!showPassword}
            />
          )}
          {modalAction === "ConfirmPassForEmailPassword" && (
            <TextInputCustom
              label="Confirme sua senha antes de alterar seu email e password"
              text={password}
              setText={setPassword}
              forModal
              secure={!showPassword}
            />
          )}
          {modalAction === "ConfirmPassForEmailPasswordName" && (
            <TextInputCustom
              label="Confirme sua senha antes de alterar seu email e password e name"
              text={password}
              setText={setPassword}
              forModal
              secure={!showPassword}
            />
          )}
          {modalAction === "ConfirmPassForEmailName" && (
            <TextInputCustom
              label="Confirme sua senha antes de alterar seu email e name"
              text={password}
              setText={setPassword}
              forModal
              secure={!showPassword}
            />
          )}
          {modalAction === "ConfirmPassForPasswordName" && (
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

          {modalAction === "ConfirmPassForName" && <IconShowPass />}
          {modalAction === "ConfirmPassForEmail" && <IconShowPass />}
          {modalAction === "ConfirmPassForPassword" && <IconShowPass />}
          {modalAction === "ConfirmPassForEmailPassword" && <IconShowPass />}
          {modalAction === "ConfirmPassForEmailPasswordName" && (
            <IconShowPass />
          )}
          {modalAction === "ConfirmPassForEmailName" && <IconShowPass />}
          {modalAction === "ConfirmPassForPasswordName" && <IconShowPass />}

          <View style={styles.buttonContainer}>
            {modalAction === "DelSelectedNotes" && <ButtonNo />}
            {modalAction === "DelNote" && <ButtonNo />}
            {modalAction === "DelTag" && <ButtonNo />}

            <View style={{ flex: 1 }}>
              {/* <View> */}
              <ButtonCustom
                onPressFunc={() => {
                  if (
                    modalAction === "DelSelectedNotes" ||
                    modalAction === "DelNote"
                  ) {
                    delNote();
                  } else if (modalAction === "DelTag") {
                    delTag();
                  } else if (
                    modalAction === "ConfirmPassForEmail" ||
                    modalAction === "ConfirmPassForPassword" ||
                    modalAction === "ConfirmPassForEmailPassword" ||
                    modalAction === "ConfirmPassForEmailPasswordName" ||
                    modalAction === "ConfirmPassForEmailName" ||
                    modalAction === "ConfirmPassForPasswordName" ||
                    modalAction === "ConfirmPassForName"
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
                  modalAction === "DelSelectedNotes" ||
                  modalAction === "DelNote" ||
                  modalAction === "DelTag"
                    ? "Yes"
                    : "Ok"
                }
                background={
                  modalAction === "DelSelectedNotes" ||
                  modalAction === "DelNote" ||
                  modalAction === "DelTag"
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
    // justifyContent: "flex-end",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
  },
});
