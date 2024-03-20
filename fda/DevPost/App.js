import Routes from "./src/routes";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor="#36393f"
        barStyle="light-content"
        translucent={false}
      />
      <Routes />
    </NavigationContainer>
  );
}
