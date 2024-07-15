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
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebaseConnection";
import CustomModal from "../components/CustomModal";

const AccountSettings = () => {
  const { user, setUser, setModalAction } = useContext(UserContext);
  const navigation = useNavigation();
  const [name, setName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [password, setPassowrd] = useState("");
  const [confirmPassword, setConfirmPassowrd] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState(user.emailVerified);
  const [modalVisible, setModalVisible] = useState(false);
  const [source, setSource] = useState("");

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
    if (name !== user.displayName) {
      // console.log("mudouuu");
      updateProfile(auth.currentUser, {
        displayName: name,
      })
        .then(() => {
          setUser(auth.currentUser);
        })
        .catch((error) => {
          // An error occurred
          // ...
        });
    }
    if (user.emailVerified) {
      if (
        password !== "" &&
        confirmPassword !== "" &&
        password === confirmPassword
      ) {
        console.log("dsas");
      } else if (email !== user.email) {
        // ("mateus.justino.07@gmail.com");
        // ("mateus_justino_07@hotmail.com");
        updateEmail(auth.currentUser, email)
          .then(() => {
            const userNow = auth.currentUser;
            userNow.reload().then(() => {
              setUser(userNow);
            });
            checkVerifiedEmail();
            setModalAction("AccountSettingsConfirmMessageEmail");
            setModalVisible(true);
          })
          .catch((error) => {
            if (error.code === "auth/requires-recent-login") {
              setModalAction("AccountSettingsConfirmEmailPass");
              setModalVisible(true);
            } else {
              alert(error.code);
            }
          });
      }
    } else {
      setModalAction("AccountSettingsVerifyEmail");
      setModalVisible(true);
    }
  };

  const sendVerifiedEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        setModalAction("AccountSettingsSendEmail");
        // console.log("enviado a verificação");
        // console.log(source);
        // alert("email enviado");
        setModalVisible(true);
      })
      .catch((error) => {
        alert(error.message);
      });
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
        <Text>
          estou com a ideia de ter salvo no banco "settings", um campo com a
          data e hora da ultima vez que a pessoa tentou verificar seu email,
          para que assim garanta que a pessoa nao fique tentando enviar email
          toda hora
        </Text>

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
          // source="AccountSettingsConfirmEmailPass"
          // source={source}
          // setSource={setSource}
          // source={usar um objeto aqui dentro}
          newEmail={email}
          newPassword={password}
          newConfirmPassword={confirmPassword}
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
