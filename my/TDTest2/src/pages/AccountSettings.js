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
    // parte do nome
    if (name !== user.displayName) {
      // console.log("mudouuu");
      updateProfile(auth.currentUser, {
        displayName: name,
      })
        .then(() => {
          setUser(auth.currentUser);
          alert("nome atualizado");
        })
        .catch((error) => {
          // An error occurred
          // ...
        });
    }

    // parte do email e senha
    if (user.emailVerified) {
      // mateus.justino.07@gmail.com
      // mateus_justino_07@hotmail.com

      // email invalido
      // invalid password
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const checkEmail = re.test(String(email).toLowerCase());

      // primeiro email e password

      // segundo apenas email

      // terceiro apenas password

      if (email !== user.email && password === confirmPassword) {
        setModalAction("AccountSettingsConfirmPassForEmailAndPassword");
        setModalVisible(true);
      }
      // if (!checkEmail) {
      //   setModalAction("AccountSettingsInvalidEmail");
      //   setModalVisible(true);
      // } else if (password < 6) {
      //   setModalAction("AccountSettingsInvalidPassword");
      //   setModalVisible(true);
      // } else if (email !== user.email) {
      //   setModalAction("AccountSettingsConfirmPassForEmail");
      //   setModalVisible(true);
      // } else if (password === confirmPassword) {
      //   setModalAction("AccountSettingsConfirmPassForPassword");
      //   setModalVisible(true);
      // }
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

        <Button title="confirm" onPress={profileUpdate} />

        <View></View>
        <Text>verificação de email</Text>
        <Text>atualizar o nome</Text>
        <Text>atualizar o email</Text>
        <Text>atualizar a senha</Text>
        <Text>
          enviar email para atualizar senha (isso posso colocar no login, em
          esqueceu a senha)
        </Text>

        <Button title="confirm" onPress={() => setModalVisible(true)} />

        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          // source="AccountSettingsConfirmPassForEmail"
          // source={source}
          // setSource={setSource}
          // source={usar um objeto aqui dentro}
          newEmail={email}
          newPassword={password}
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
