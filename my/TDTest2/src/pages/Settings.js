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
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { iconSize } from "../theme/icon";
import ButtonCustom from "../components/ButtonCustom";

const Settings = () => {
  const navigation = useNavigation();
  const { setUser } = useContext(UserContext);

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        // console.log("deslogadoaaaa");
        navigation.navigate("SignIn");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const OptionSetting = ({ title, icon, navigate }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate(navigate)}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
            gap: 10,
          }}
        >
          {icon}
          <Text>{title}</Text>
        </View>
      </TouchableOpacity>
    );
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
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <View>
            <OptionSetting
              title="Tags"
              icon={
                <Ionicons
                  name="pricetags-outline"
                  size={iconSize.regular}
                  color="black"
                />
              }
              navigate="SettingsTags"
            />
            <OptionSetting
              title="Account Settings"
              icon={
                <Feather name="user" size={iconSize.regular} color="black" />
              }
              navigate="AccountSettings"
            />

            <Text>logo</Text>

            <Text selectable>link do código</Text>

            <Text>duvida, errro, sugestao pelo email</Text>
            <Text>
              colocar algo ou uma tela para quando o usuario esta sem internet?
            </Text>
          </View>
          <View>
            <ButtonCustom
              title="Logout"
              onPressFunc={handleLogOut}
              background={colors.buttonRed}
              icon={
                <SimpleLineIcons
                  name="logout"
                  size={iconSize.regular}
                  color="white"
                />
              }
            />
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
