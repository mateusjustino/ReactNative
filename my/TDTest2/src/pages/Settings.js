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
    signOut(auth)
      .then(() => {
        navigation.navigate("SignIn");
        setUser({});
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Header fromSettings />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={{ height: 50 }} />
        <TouchableOpacity onPress={() => navigation.navigate("SettingsTags")}>
          <Text>tags</Text>
        </TouchableOpacity>
        <View style={{ height: 50 }} />

        <Text>darkmode</Text>
        <View style={{ height: 50 }} />

        <TouchableOpacity
          onPress={() => navigation.navigate("AccountSettings")}
        >
          <Text>Account Settings</Text>
        </TouchableOpacity>
        <View style={{ height: 50 }} />

        <TouchableOpacity onPress={handleLogOut}>
          <Text>logout</Text>
        </TouchableOpacity>
        <View style={{ height: 50 }} />

        <Text>adicionar about</Text>
        <View style={{ height: 50 }} />
        <Text>send feedback?</Text>
        <View style={{ height: 50 }} />
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
