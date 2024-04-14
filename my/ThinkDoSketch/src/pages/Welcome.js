import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useFonts } from "expo-font";
import { SharedElement } from "react-navigation-shared-element";

const Welcome = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    MerriweatherRegular: require("../fonts/Merriweather-Regular.ttf"),
  });
  if (fontsLoaded) {
    return (
      <View>
        <Text style={{ fontSize: 50 }}>Welcome</Text>
        <Text style={{ fontSize: 50, fontFamily: "MerriweatherRegular" }}>
          Welcome
        </Text>
        <SharedElement id="button">
          <Button
            title="go to home"
            onPress={() => navigation.navigate("Home")}
          />
        </SharedElement>
      </View>
    );
  }
};

export default Welcome;

const styles = StyleSheet.create({});
