import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import Header from "../components/Header";
import { UserContext } from "../context/userContext";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConnection";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import CustomModal from "../components/CustomModal";
import colors from "../theme/colors";

const Settings = () => {
  const navigation = useNavigation();
  const { setUser } = useContext(UserContext);

  const handleLogOut = () => {
    // signOut(auth)
    //   .then(() => {
    //     setUser({});
    //     navigation.navigate("SignIn");
    //   })
    //   .catch((error) => {
    //     alert(error.message);
    //   });
    signOut(auth)
      .then(() => {
        console.log("deslogadoaaaa");
        navigation.navigate("SignIn");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <>
      <Header fromSettings />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          alignItems: "center",
          flex: 1,
        }}
      >
        <View
          style={{
            // height: "100%",
            // backgroundColor: "red",
            // alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate("SettingsTags")}
            >
              <Text>tags</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("AccountSettings")}
            >
              <Text>Account Settings</Text>
            </TouchableOpacity>

            <Text>adicionar about</Text>

            <Text>send feedback?</Text>
            <Text>
              colocar algo ou uma tela para quando o usuario esta sem internet?
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={handleLogOut}>
              <Text>logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLight,
    padding: 10,
  },
  inputView: {
    marginVertical: 10,
    padding: 10,
    paddingTop: 10,
    paddingBottom: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderColorLight,
  },
});
