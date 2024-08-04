import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  Image,
  Linking,
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
  AntDesign,
} from "@expo/vector-icons";
import { iconSize, iconSource } from "../theme/icon";
import ButtonCustom from "../components/ButtonCustom";
import { fontFamily, fontSize } from "../theme/font";

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
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: colors.borderColorLight,
          // paddingBottom: 10,
          marginVertical: 10,
          paddingStart: 5,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigate === "logout"
              ? handleLogOut()
              : navigation.navigate(navigate)
          }
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              // marginVertical: 10,
              gap: 15,
              // borderBottomWidth: 1,
              // borderColor: colors.borderColorLight,
              paddingBottom: 10,
            }}
          >
            {icon}
            <Text
              style={{
                fontFamily: fontFamily.PoppinsRegular400,
                fontSize: fontSize.regular,
                // backgroundColor: "red",
                paddingTop: 4,
              }}
            >
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const handlePress = () => {
    const url = "https://github.com/justmatedev";
    Linking.openURL(url).catch((err) =>
      console.error("Erro ao tentar abrir o link:", err)
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
            // justifyContent: "space-between",
            flex: 1,
            width: "100%",
          }}
        >
          {/* about container */}
          <View style={{ alignItems: "center", marginVertical: 40 }}>
            <Image
              style={{ height: 35 * 2.5, width: 64 * 2.5 }}
              source={iconSource.logoRoxo}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 20,
                gap: 15,
              }}
            >
              <Text style={[styles.text, { paddingTop: 4 }]}>Source Code:</Text>
              <TouchableOpacity onPress={handlePress}>
                <AntDesign
                  name="github"
                  size={iconSize.regular}
                  color={colors.primaryPurple}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.text}>duvida, errro, sugestao pelo email:</Text>
            <Text style={styles.text} selectable>
              justmatedev@gmail.com
            </Text>
          </View>
          <OptionSetting
            title="Tags"
            icon={
              <Ionicons
                name="pricetags-outline"
                size={iconSize.regular}
                color={colors.primaryPurple}
              />
            }
            navigate="SettingsTags"
          />
          <OptionSetting
            title="Account Settings"
            icon={
              <Feather
                name="user"
                size={iconSize.regular}
                color={colors.primaryPurple}
              />
            }
            navigate="AccountSettings"
          />
          <OptionSetting
            title="Logout"
            icon={
              <SimpleLineIcons
                name="logout"
                size={iconSize.regular}
                color={colors.buttonRed}
              />
            }
            navigate="logout"
          />

          {/* <Text>
              colocar algo ou uma tela para quando o usuario esta sem internet?
            </Text> */}
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
  text: {
    fontFamily: fontFamily.PoppinsRegular400,
    fontSize: fontSize.regular,
  },
});
