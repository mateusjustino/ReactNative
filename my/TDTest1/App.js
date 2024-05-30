import { NavigationContainer } from "@react-navigation/native";
import AppRoutes from "./src/routes/app.routes";
import UserContextProvider from "./src/context/userContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
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
