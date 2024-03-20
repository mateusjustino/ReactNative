import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import AuthRoutes from "./auth.routes";
import AppRoutes from "./app.routes";

const Routes = () => {
  const signed = false;
  const loading = false;

  if (loading) {
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#36393f",
      }}
    >
      <ActivityIndicator size={50} color="#e52246" />
    </View>;
  }

  return signed ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;

const styles = StyleSheet.create({});
