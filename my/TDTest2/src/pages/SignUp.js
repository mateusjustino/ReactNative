import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useContext, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebaseConnection";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { UserContext } from "../context/userContext";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { configureNavigationBar } from "../scripts/NavigationBar";
import colors from "../theme/colors";
import { StatusBar } from "expo-status-bar";
import Clouds from "../components/Clouds";
import { iconSize, iconSource } from "../theme/icon";
import TextInputCustom from "../components/TextInputCustom";
import ButtonCustom from "../components/ButtonCustom";
import { fontFamily, fontSize } from "../theme/font";
import { Ionicons } from "@expo/vector-icons";

const SignUp = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user, setUser, EnterUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      configureNavigationBar(colors.primaryPurple);
    }, [])
  );

  const handleRegister = () => {
    if (email && password) {
      setLoadingRegister(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed up
          // const user = userCredential.user;
          // console.log(user);

          updateProfile(auth.currentUser, {
            displayName: name,
          });

          // EnterUser(userCredential.user); // era esse que eu estava utilizando

          // provavel que nao precise criar um doc vazio no banco aqui
          await setDoc(doc(db, "settings", userCredential.user.uid), {
            tags: [],
            LastTimeSendVerifiedEmail: null,
          });

          signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              console.log(userCredential.user);
              EnterUser(userCredential.user);
              navigation.navigate("Home");
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              alert(errorMessage);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
        });
      setLoadingRegister(false);
    }
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
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
              >
                <TextInputCustom
                  text={name}
                  setText={(text) => setName(text)}
                  label="Name"
                  autoCapitalize="none"
                />
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
                    justifyContent: "flex-end",
                    paddingHorizontal: 5,
                    alignItems: "center",
                  }}
                >
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
                <TextInputCustom
                  text={confirmPassword}
                  setText={(text) => setConfirmPassword(text)}
                  label="Confirm Password"
                  secure={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    paddingHorizontal: 5,
                    alignItems: "center",
                    // marginBottom: 15,
                  }}
                >
                  {showConfirmPassword ? (
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(false)}
                      activeOpacity={0.5}
                    >
                      <Ionicons
                        name="eye-outline"
                        size={iconSize.regular}
                        color={colors.primaryPurple}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(true)}
                    >
                      <Ionicons
                        name="eye-off-outline"
                        size={iconSize.regular}
                        color={colors.primaryPurple}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                <ButtonCustom
                  title="Register"
                  background={colors.primaryPurple}
                  onPressFunc={handleRegister}
                  active={loadingRegister}
                />
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Text style={[styles.text]}>Already have a account? </Text>
                  <TouchableOpacity
                    style={{}}
                    onPress={() => navigation.navigate("SignIn")}
                  >
                    <Text
                      style={[styles.text, { color: colors.primaryPurple }]}
                    >
                      Sing in
                    </Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </View>
          </View>
        </ScrollView>
        <Clouds bottom />
      </View>
    </>
  );
};

export default SignUp;

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
