import {
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
  View,
  Image,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar as StatusBarExpo } from "expo-status-bar";
import colors from "../theme/colors";
import { iconSize, iconSource } from "../theme/icon";
import { fontFamily, fontSize } from "../theme/font";

export default function Header({
  fromHome,
  fromAddEditNote,
  fromSettings,
  setModalVisible,
  canDelete,
}) {
  const navigation = useNavigation();
  const { user, statusBarColor } = useContext(UserContext);

  useEffect(() => {
    colorBackground();
  }, [statusBarColor]);

  const colorBackground = () => {
    if (
      statusBarColor === "#7d6464" ||
      statusBarColor === colors.customBackgroundNoteRed
    ) {
      return colors.customBackgroundNoteRed;
    } else if (
      statusBarColor === "#647d64" ||
      statusBarColor === colors.customBackgroundNoteGreen
    ) {
      return colors.customBackgroundNoteGreen;
    } else if (
      statusBarColor === "#64647d" ||
      statusBarColor === colors.customBackgroundNoteBlue
    ) {
      return colors.customBackgroundNoteBlue;
    } else if (
      statusBarColor === "#7b7e6e" ||
      statusBarColor === colors.backgroundLight
    ) {
      return colors.backgroundLight;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colorBackground() }]}
    >
      <StatusBarExpo backgroundColor={statusBarColor} style="dark-content" />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 15,
        }}
      >
        {fromHome && (
          <>
            <View
              style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
            >
              <Image
                style={{ height: 35, width: 64, marginRight: 10 }}
                source={iconSource.logoRoxo}
              />
              <Text
                style={{
                  fontSize: fontSize.regular,
                  width: "70%",
                  fontFamily: fontFamily.PoppinsRegular400,
                }}
                numberOfLines={1}
              >
                Olá, {user.email}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
              <Ionicons
                name="menu-outline"
                size={iconSize.regular}
                color="black"
              />
            </TouchableOpacity>
          </>
        )}
        {fromAddEditNote && (
          <>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="chevron-back"
                size={iconSize.regular}
                color="black"
              />
            </TouchableOpacity>
            {canDelete ? (
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Ionicons
                  name="trash-outline"
                  size={iconSize.regular}
                  color="red"
                />
              </TouchableOpacity>
            ) : (
              <Text
                style={{
                  fontSize: fontSize.regular,
                  fontFamily: fontFamily.PoppinsRegular400,
                }}
              >
                New Note
              </Text>
            )}
          </>
        )}
        {fromSettings && (
          <>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="chevron-back"
                size={iconSize.regular}
                color="black"
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 10,
  },
});
