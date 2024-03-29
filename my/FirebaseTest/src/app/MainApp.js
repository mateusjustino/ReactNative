import { StyleSheet, Text, View, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../firebaseConnection";
import { signOut, onAuthStateChanged } from "firebase/auth";

const MainApp = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log(user);
        console.log("-".repeat(99));
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
        <Text>
          link para reautenticar user no comentario
          {/* https://stackoverflow.com/questions/37811684/how-to-create-credential-object-needed-by-firebase-web-user-reauthenticatewith */}
        </Text>
        <View style={{ margin: 10 }}>
          <Button
            title="Update Password"
            onPress={() => navigation.navigate("UpdatePassword")}
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
          <Button
            title="Database"
            onPress={() => navigation.navigate("Database")}
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
