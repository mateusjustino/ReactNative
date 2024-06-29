import { Button, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import Header from "../components/Header";
import { UserContext } from "../context/userContext";
import { fontFamily } from "../theme/font";

const Welcome = ({ navigation }) => {
  // const [fontsLoaded] = useFonts({
  //   MerriweatherRegular: require("../fonts/Poppins-Regular.ttf"),
  //   MerriweatherItalic: require("../fonts/Poppins-Italic.ttf"),
  //   MerriweatherBold: require("../fonts/Poppins-Bold.ttf"),
  // });

  // const { timezone } = useContext(UserContext);

  return (
    <>
      <Header />
      <View>
        <Text style={{ fontSize: 50, fontStyle: "italic" }}>Welcome</Text>
        <Text
          style={{
            fontSize: 40,
            // fontFamily: "PoppinsRegular400",
            fontFamily: fontFamily.PoppinsRegular400,
          }}
        >
          Welcome
        </Text>
        <Text
          style={{
            fontSize: 40,
            // fontFamily: "PoppinsRegularItalic400",
            fontFamily: fontFamily.PoppinsRegularItalic400,
          }}
        >
          Welcome
        </Text>
        <Button
          title="go to home"
          onPress={() => navigation.navigate("Home")}
        />
      </View>
    </>
  );
};

export default Welcome;

const styles = StyleSheet.create({});
