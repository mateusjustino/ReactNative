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
import { Feather } from "@expo/vector-icons";
import { iconSize } from "../theme/icon";
import { useNavigation } from "@react-navigation/native";
import {
  onAuthStateChanged,
  sendEmailVerification,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebaseConnection";

const AccountSettings = () => {
  const { user, setUser } = useContext(UserContext);
  const navigation = useNavigation();
  const [name, setName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [verifiedEmail, setVerifiedEmail] = useState(user.emailVerified);

  const profileUpdate = () => {
    if (name !== user.displayName) {
      console.log("mudouuu");
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
    if (email !== user.email) {
      if (user.emailVerified) {
        // aqui eu devo reauntenticar o usuario caso necessario
        // voltar aqui
        // voltar aqui
        // voltar aqui
        // voltar aqui
        // voltar aqui
        // voltar aqui
        // voltar aqui
        // voltar aqui
        // voltar aqui
        // voltar aqui
        // voltar aqui
        // voltar aqui
        // voltar aqui
        updateEmail(auth.currentUser, email)
          .then(() => setUser(auth.currentUser))
          .catch((error) => {
            alert(error.message);
            alert(error.code);
          });
      }
    }
  };

  const sendVerifiedEmail = () => {
    // auth.useDeviceLanguage() // para utilizar o idioma do navegador
    sendEmailVerification(auth.currentUser)
      .then(() => {
        alert("email enviado");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const checkVerifiedEmail = () => {
    const user = auth.currentUser;
    user.reload().then(() => {
      if (user.emailVerified) {
        setUser(user);
        setVerifiedEmail(user.emailVerified);
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
        <Text>email verified? {verifiedEmail ? "sim" : "nao"}</Text>
        {!verifiedEmail && (
          <>
            <Text>conta nao verificada</Text>
            <Text>para verificar email</Text>
            <TouchableOpacity onPress={sendVerifiedEmail}>
              <Text>Clique aqui</Text>
            </TouchableOpacity>
            <Text>Caso tenha acabado verificar</Text>
            <TouchableOpacity onPress={checkVerifiedEmail}>
              <Text>atualize aqui</Text>
            </TouchableOpacity>
          </>
        )}

        <Text>Name</Text>
        <TextInputCustom text={name} setText={setName} />

        <Text>Email</Text>
        <TextInputCustom text={email} setText={setEmail} />
        <Text>email do userContext: {user.email}</Text>

        <Text>Senha</Text>
        <TextInputCustom text={email} setText={setEmail} />
        <Text>Confirmar Senha</Text>
        <TextInputCustom text={email} setText={setEmail} />

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
      </ScrollView>
    </>
  );
  // return (
  //   <>
  //     <Header fromSettings />
  //     <ScrollView
  //       style={styles.container}
  //       contentContainerStyle={{ alignItems: "center" }}
  //     >
  //       <TextInputCustom text={text} setText={setText} placeholder="teste" />

  //       <TouchableOpacity
  //         style={styles.containerInfo}
  //         onPress={() => navigation.navigate("AccountSettingsUpdateName")}
  //       >
  //         <Text>Nome: {user.displayName}</Text>
  //         <TouchableOpacity
  //           onPress={() => navigation.navigate("AccountSettingsUpdateName")}
  //         >
  //           <Feather
  //             name="edit"
  //             size={iconSize.regular}
  //             color={colors.primaryBlue}
  //           />
  //         </TouchableOpacity>
  //       </TouchableOpacity>
  //       <Text>verificação de email</Text>
  //       <Text>atualizar o nome</Text>
  //       <Text>atualizar o email</Text>
  //       <Text>atualizar a senha</Text>
  //       <Text>
  //         enviar email para atualizar senha (isso posso colocar no login, em
  //         esqueceu a senha)
  //       </Text>
  //     </ScrollView>
  //   </>
  // );
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
