import { StyleSheet, Text, View, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../firebaseConnection";
import { signOut, onAuthStateChanged } from "firebase/auth";

const MainApp = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // setUser({
        //   email: user.email,
        //   uid: user.uid,
        // });
        setUser(user);
        console.log(user);
        return;
      }
      setUser(null);
    });
  }, []);

  const handleLogout = () => {
    alert("asds");
    signOut(auth)
      .then(() => {
        setUser(null);
        navigation.navigate("SignIn");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (user) {
    return (
      <View style={styles.container}>
        <Text>MainApp</Text>
        <Text>Olá, {user.displayName}</Text>
        <Text>Email: {user.email}</Text>
        <Text>Email verificado? {user.emailVerified ? "sim" : "não"}</Text>
        <View style={{ margin: 10 }}>
          <Button
            title="Update Profile"
            onPress={() => navigation.navigate("UpdateProfile")}
          />
        </View>
        <View style={{ margin: 10 }}>
          <Button
            title="Update Email"
            onPress={() => navigation.navigate("UpdateEmail")}
          />
        </View>
        <View style={{ margin: 10 }}>
          <Button
            title="Update Password (fazer agoraaa)"
            onPress={() => navigation.navigate("")}
          />
        </View>
        <View style={{ margin: 10 }}>
          <Button
            title="Verify Email"
            onPress={() => navigation.navigate("VerifyEmail")}
          />
        </View>
        <View style={{ margin: 10 }}>
          <Button
            title="Password Reset"
            onPress={() => navigation.navigate("PasswordReset")}
          />
        </View>
        <View style={{ margin: 10 }}>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text>no user logged</Text>
    </View>
  );
};

export default MainApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
