import { Button, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../../contexts/auth";

const Profile = () => {
  const { signOut } = useContext(AuthContext);

  async function handleSignOut() {
    await signOut();
  }
  return (
    <View>
      <Text>Profile</Text>
      <Button title="Sair" onPress={handleSignOut} />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
