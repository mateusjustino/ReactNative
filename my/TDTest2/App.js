import { NavigationContainer } from "@react-navigation/native";
import AppRoutes from "./src/routes/app.routes";
import UserContextProvider from "./src/context/userContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";

export default function App() {
  const [fontsLoaded] = useFonts({
    PoppinsThin100: require("./src/fonts/Poppins-Thin.ttf"),
    PoppinsThinItalic100: require("./src/fonts/Poppins-ThinItalic.ttf"),
    PoppinsExtraLight200: require("./src/fonts/Poppins-ExtraLight.ttf"),
    PoppinsExtraLightItalic200: require("./src/fonts/Poppins-ExtraLightItalic.ttf"),
    PoppinsLight300: require("./src/fonts/Poppins-Light.ttf"),
    PoppinsLightItalic300: require("./src/fonts/Poppins-LightItalic.ttf"),
    PoppinsRegular400: require("./src/fonts/Poppins-Regular.ttf"),
    PoppinsRegularItalic400: require("./src/fonts/Poppins-Italic.ttf"),
    PoppinsMedium500: require("./src/fonts/Poppins-Medium.ttf"),
    PoppinsMediumItalic500: require("./src/fonts/Poppins-MediumItalic.ttf"),
    PoppinsSemiBold600: require("./src/fonts/Poppins-SemiBold.ttf"),
    PoppinsSemiBoldItalic600: require("./src/fonts/Poppins-SemiBoldItalic.ttf"),
    PoppinsBold700: require("./src/fonts/Poppins-Bold.ttf"),
    PoppinsBoldItalic700: require("./src/fonts/Poppins-BoldItalic.ttf"),
    PoppinsExtraBold800: require("./src/fonts/Poppins-ExtraBold.ttf"),
    PoppinsExtraBoldItalic800: require("./src/fonts/Poppins-ExtraBoldItalic.ttf"),
    PoppinsBlack900: require("./src/fonts/Poppins-Black.ttf"),
    PoppinsBlackItalic900: require("./src/fonts/Poppins-BlackItalic.ttf"),
  });

  if (fontsLoaded) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <UserContextProvider>
            <AppRoutes />
          </UserContextProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
    );
  }
}
