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
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebaseConnection";
import { signInWithEmailAndPassword } from "firebase/auth";
import { UserContext } from "../context/userContext";
import TextInputCustom from "../components/TextInputCustom";
import ButtonCustom from "../components/ButtonCustom";
import colors from "../theme/colors";
import { iconSize, iconSource } from "../theme/icon";
import { fontFamily, fontSize } from "../theme/font";
import CheckBox from "../components/CheckBox";
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "../components/Header";
import { StatusBar } from "expo-status-bar";
import Clouds from "../components/Clouds";
import { configureNavigationBar } from "../scripts/NavigationBar";

const SignIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("mateus_justino_07@hotmail.com");
  const [password, setPassword] = useState("123123");
  const { user, setUser, EnterUser } = useContext(UserContext);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    configureNavigationBar(colors.primaryPurple);
    return () => {};
  }, []);

  const handleLogin = () => {
    if (email && password) {
      setLoadingLogin(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // const user = userCredential.user;
          // console.log(userCredential.user);

          // setUser(userCredential.user);
          EnterUser(userCredential.user);

          navigation.navigate("Home");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
          console.log(errorCode);
          console.log(errorMessage);
          console.log(error);
        });
      setLoadingLogin(false);
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: colors.backgroundLight }}>
        {/* Primeira View - Topo */}

        <Clouds />
        {/* <Text style={{ textAlign: "center" }}>|</Text> */}
        {/* <Button title="a" /> */}

        {/* Segunda View - Área central com Scroll */}
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
                placeholder="email"
                label="Email"
              />

              <TextInputCustom
                text={password}
                setText={(text) => setPassword(text)}
                placeholder="password"
                label="Password"
                secure={!showPassword}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 5,
                  // height: 50,
                  alignItems: "center",
                  marginBottom: 15,
                }}
              >
                <TouchableOpacity>
                  <Text style={[styles.text, { color: colors.primaryPurple }]}>
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
                title="SignIn"
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
                  <Text style={[styles.text, { color: colors.primaryPurple }]}>
                    SingUp
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Terceira View - Final */}
        <Clouds bottom />
      </View>
    </>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    // backgroundColor: colors.backgroundLight,
    // padding: 10,
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
