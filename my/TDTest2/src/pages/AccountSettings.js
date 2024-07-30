import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useContext, useState } from "react";
import Header from "../components/Header";
import colors from "../theme/colors";
import TextInputCustom from "../components/TextInputCustom";
import { UserContext } from "../context/userContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import { iconSize } from "../theme/icon";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  onAuthStateChanged,
  sendEmailVerification,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebaseConnection";
import CustomModal from "../components/CustomModal";
import moment from "moment";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ButtonCustom from "../components/ButtonCustom";

const AccountSettings = () => {
  const { user, setUser, setModalAction } = useContext(UserContext);
  const navigation = useNavigation();
  const [name, setName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [password, setPassowrd] = useState("");
  const [confirmPassword, setConfirmPassowrd] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState(user.emailVerified);
  const [modalVisible, setModalVisible] = useState(false);
  // const [source, setSource] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = navigation.addListener("beforeRemove", () => {
        setModalAction("");
        return true;
      });

      return unsubscribe;
    }, [])
  );

  const profileUpdate = () => {
    // parte do email e senha
    if (user.emailVerified) {
      // mateus.justino.07@gmail.com
      // mateus_justino_07@hotmail.com

      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const checkEmail = re.test(String(email).toLowerCase());

      //  email e password e name
      if (
        name !== user.displayName &&
        email !== user.email &&
        password !== ""
      ) {
        if (name !== "") {
          if (checkEmail) {
            if (password.length > 5) {
              if (password === confirmPassword) {
                console.log("caiu aquiii");
                setModalAction(
                  "AccountSettingsConfirmPassForEmailPasswordAndName"
                );
                setModalVisible(true); // não preciso deixar um setModalVisible(true) em cada if ........
              } else {
                setModalAction("AccountSettingsPasswordConfirmDifferent");
                setModalVisible(true);
              }
            } else {
              setModalAction("AccountSettingsPasswordShort");
              setModalVisible(true);
            }
          } else {
            setModalAction("AccountSettingsInvalidEmail");
            setModalVisible(true);
          }
        } else {
          setModalAction("AccountSettingsEmptyName");
          setModalVisible(true);
        }
      }
      // name e email
      else if (name !== user.displayName && email !== user.email) {
        if (name !== "") {
          if (checkEmail) {
            setModalAction("AccountSettingsConfirmPassForEmailAndName");
            setModalVisible(true);
          } else {
            setModalAction("AccountSettingsInvalidEmail");
            setModalVisible(true);
          }
        } else {
          setModalAction("AccountSettingsEmptyName");
          setModalVisible(true);
        }
      }

      // name e password
      else if (name !== user.displayName && password !== "") {
        if (name !== "") {
          if (password.length > 5) {
            if (password === confirmPassword) {
              setModalAction("AccountSettingsConfirmPassForPasswordAndName");
              setModalVisible(true);
            } else {
              setModalAction("AccountSettingsPasswordConfirmDifferent");
              setModalVisible(true);
            }
          } else {
            setModalAction("AccountSettingsPasswordShort");
            setModalVisible(true);
          }
        } else {
          setModalAction("AccountSettingsEmptyName");
          setModalVisible(true);
        }
      }

      // aqui para baixo ja testado
      // primeiro email e password
      else if (email !== user.email && password !== "") {
        if (checkEmail) {
          if (password.length > 5) {
            if (password === confirmPassword) {
              setModalAction("AccountSettingsConfirmPassForEmailAndPassword");
              setModalVisible(true);
            } else {
              setModalAction("AccountSettingsPasswordConfirmDifferent");
              setModalVisible(true);
            }
          } else {
            setModalAction("AccountSettingsPasswordShort");
            setModalVisible(true);
          }
        } else {
          setModalAction("AccountSettingsInvalidEmail");
          setModalVisible(true);
        }
      }
      // segundo apenas email
      else if (email !== user.email) {
        if (checkEmail) {
          setModalAction("AccountSettingsConfirmPassForEmail");
          setModalVisible(true);
        } else {
          setModalAction("AccountSettingsInvalidEmail");
          setModalVisible(true);
        }
      }
      // terceiro apenas password
      else if (password !== "") {
        if (password.length > 5) {
          if (password === confirmPassword) {
            setModalAction("AccountSettingsConfirmPassForPassword");
            setModalVisible(true);
          } else {
            setModalAction("AccountSettingsPasswordConfirmDifferent");
            setModalVisible(true);
          }
        } else {
          setModalAction("AccountSettingsPasswordShort");
          setModalVisible(true);
        }
      }
      // quarto apenas name
      else if (name !== user.displayName) {
        if (name !== "") {
          setModalAction("AccountSettingsConfirmPassForName");
          setModalVisible(true);
        } else {
          setModalAction("AccountSettingsEmptyName");
          setModalVisible(true);
        }
      }
    } else {
      setModalAction("AccountSettingsVerifyEmail");
      setModalVisible(true);
    }
  };

  const sendVerifiedEmail = async () => {
    ("mateus.justino.07@gmail.com");
    ("mateus_justino_07@hotmail.com");
    const docRef = doc(db, "settings", user.uid);
    const docSnap = await getDoc(docRef);
    const lastDate = docSnap.data().LastTimeSendVerifiedEmail;
    const lastDateMoment = moment(lastDate, "YYYY-MM-DD HH:mm:ss");
    // const now = moment().format("YYYY-MM-DD HH:mm:ss");
    const now = moment();

    const lastDatePlus = lastDateMoment.add(1, "minutes");

    if (now.isAfter(lastDatePlus) || !lastDate) {
      sendEmailVerification(auth.currentUser)
        .then(async () => {
          setModalAction("AccountSettingsSendEmail");
          setModalVisible(true);
          const nowDate = moment().format("YYYY-MM-DD HH:mm:ss");
          const settingsRef = doc(db, "settings", user.uid);
          await updateDoc(settingsRef, {
            LastTimeSendVerifiedEmail: nowDate,
          });
        })
        .catch((error) => {
          alert(error.message);
        });
    } else {
      setModalAction("AccountSettingsTooManyRequests");
      setModalVisible(true);
    }
  };

  const checkVerifiedEmail = () => {
    const userNow = auth.currentUser;
    userNow.reload().then(() => {
      if (userNow.emailVerified) {
        setUser(userNow);
        setVerifiedEmail(true);
      } else {
        setVerifiedEmail(false);
      }
    });
  };

  return (
    <>
      <Header fromSettings />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <Text>Account Settings</Text>

        <TextInputCustom text={name} setText={setName} label="Name" />

        <TextInputCustom text={email} setText={setEmail} label="Email" />
        {!verifiedEmail && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={sendVerifiedEmail}
              style={{ width: "90%", backgroundColor: colors.primaryGreen }}
            >
              <Text style={{ textAlign: "center" }}>Verificar Email</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={checkVerifiedEmail}>
              <Ionicons
                name="refresh"
                size={iconSize.regular}
                color={colors.primaryBlue}
              />
            </TouchableOpacity>
          </View>
        )}

        <TextInputCustom text={password} setText={setPassowrd} label="Senha" />
        <TextInputCustom
          text={confirmPassword}
          setText={setConfirmPassowrd}
          label="Confirmar Senha"
        />

        {/* <Button title="confirm" onPress={profileUpdate} /> */}
        <ButtonCustom title="Confirm" />

        <View></View>
        <Text>verificação de email</Text>
        <Text>atualizar o nome</Text>
        <Text>atualizar o email</Text>
        <Text>atualizar a senha</Text>
        <Text>
          enviar email para atualizar senha (isso posso colocar no login, em
          esqueceu a senha)
        </Text>

        {/* <Button title="confirm" onPress={() => setModalVisible(true)} /> */}

        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          // source="AccountSettingsConfirmPassForEmail"
          // source={source}
          // setSource={setSource}
          // source={usar um objeto aqui dentro}
          newEmail={email}
          newPassword={password}
          newName={name}
          checkVerifiedEmail={checkVerifiedEmail}
        />
      </ScrollView>
    </>
  );
};

export default AccountSettings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLight,
    padding: 10,
  },
  containerInfo: {
    flexDirection: "row",
    width: "100%",
    // backgroundColor: "red",
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
});
