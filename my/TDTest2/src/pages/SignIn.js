import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Button,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { auth } from "../firebaseConnection";
import { signInWithEmailAndPassword } from "firebase/auth";
import { UserContext } from "../context/userContext";
import TextInputCustom from "../components/TextInputCustom";
import ButtonCustom from "../components/ButtonCustom";
import colors from "../theme/colors";
import { iconSize, iconSource } from "../theme/icon";
import { fontFamily, fontSize } from "../theme/font";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import { StatusBar } from "expo-status-bar";
import Clouds from "../components/Clouds";
import { configureNavigationBar } from "../scripts/NavigationBar";
import CustomModal from "../components/CustomModal";

const SignIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser, EnterUser, setModalAction } = useContext(UserContext);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      configureNavigationBar(colors.primaryPurple);

      const unsubscribe = navigation.addListener("beforeRemove", () => {
        setModalAction("");
        return true;
      });

      return unsubscribe;
    }, [])
  );

  const handleLogin = () => {
    if (email && password) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const checkEmail = re.test(String(email).toLowerCase());
      if (checkEmail) {
        setLoadingLogin(true);
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            EnterUser(userCredential.user);

            navigation.navigate("Home");
          })
          .catch((error) => {
            console.log(error.code);
            console.log(error.message);
            if (error.code === "auth/user-not-found") {
              setModalAction("UserNotFound");
              setModalVisible(true);
            }
            if (error.code === "auth/wrong-password") {
              setModalAction("WrongPassword");
              setModalVisible(true);
            }
            if (error.code === "auth/too-many-requests") {
              setModalAction("TooManyRequests");
              setModalVisible(true);
            }
          });
        setLoadingLogin(false);
      } else {
        setModalAction("AccountSettingsInvalidEmail");
        setModalVisible(true);
      }
    }
  };

  const forgotPassword = () => {
    // console.log("dsasds");
    setModalAction("ConfirmEmailForSendPasswordReset");
    setModalVisible(true);
  };

  return (
    <>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: colors.backgroundLight }}>
        <Clouds />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingVertical: 10,
          }}
        >
          <View style={styles.container}>
            <View style={{ marginBottom: 50 }}>
              <Image
                style={{ height: 35 * 2.2, width: 64 * 2.2 }}
                source={iconSource.logoRoxo}
              />
            </View>
            <View style={styles.form}>
              <TextInputCustom
                text={email}
                setText={(text) => setEmail(text)}
                label="Email"
                inputMode="email"
                autoCapitalize="none"
              />

              <TextInputCustom
                text={password}
                setText={(text) => setPassword(text)}
                label="Password"
                secure={!showPassword}
                autoCapitalize="none"
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 5,
                  alignItems: "center",
                  marginBottom: 15,
                }}
              >
                <TouchableOpacity onPress={forgotPassword}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: colors.primaryPurple,
                        textDecorationLine: "underline",
                      },
                    ]}
                  >
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
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

              <ButtonCustom
                title="Login"
                background={colors.primaryPurple}
                onPressFunc={handleLogin}
                active={loadingLogin}
              />
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Text style={[styles.text]}>Don't have account? </Text>
                <TouchableOpacity
                  style={{}}
                  onPress={() => navigation.navigate("SignUp")}
                >
                  <Text
                    style={[
                      styles.text,
                      {
                        color: colors.primaryPurple,
                        textDecorationLine: "underline",
                      },
                    ]}
                  >
                    Sing up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
        <Clouds bottom />
      </View>
    </>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    zIndex: 98,
  },
  form: {
    width: "95%",
    maxWidth: 500,
    paddingBottom: 10,
    zIndex: 99,
  },
  text: {
    fontSize: fontSize.regular,
    fontFamily: fontFamily.PoppinsRegular400,
  },
});
