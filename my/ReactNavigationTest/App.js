import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

import FirstScreen from "./src/FirstScreen";
import SecondScreen from "./src/SecondScreen";
import MaterialTab from "./src/MaterialTab";
import BottomTab from "./src/BottomTab";

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="FirstScreen"
        screenOptions={{
          headerShown: false,
          // animationTypeForReplace: "pop",
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="FirstScreen" component={FirstScreen} />
        <Stack.Screen name="SecondScreen" component={SecondScreen} />
        <Stack.Screen
          name="MaterialTab"
          component={MaterialTab}
          options={{ animation: "fade_from_bottom" }}
        />
        <Stack.Screen
          name="BottomTab"
          component={BottomTab}
          options={{ animation: "fade_from_bottom" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    margin: 10,
    fontSize: 18,
  },
});
