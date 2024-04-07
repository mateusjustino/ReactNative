import { NavigationContainer } from "@react-navigation/native";
import Routes from "./src/routes/app.routes";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { colors } from "./src/theme/palette";

export default function App() {
  const colorWithAlpha = `${colors.color6}cc`;
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
    >
      <StatusBar style="light" backgroundColor={colorWithAlpha} translucent />
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
