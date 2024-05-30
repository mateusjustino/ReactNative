import { Button, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import Header from "../components/Header";
import { UserContext } from "../context/userContext";

const Welcome = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    MerriweatherRegular: require("../fonts/Merriweather-Regular.ttf"),
  });

  const { timezone } = useContext(UserContext);

  if (fontsLoaded) {
    return (
      <>
        <Header />
        <View>
          <Text style={{ fontSize: 50 }}>Welcome</Text>
          <Text style={{ fontSize: 50, fontFamily: "MerriweatherRegular" }}>
            Welcome
          </Text>
          <Text>{timezone}</Text>
          <Button
            title="go to home"
            onPress={() => navigation.navigate("Home")}
          />
        </View>
      </>
    );
  }
};

export default Welcome;

const styles = StyleSheet.create({});
