import { NavigationContainer } from "@react-navigation/native";
import Routes from "./src/routes";
import Provider from "./src/context/Context";
export default function App() {
  return (
    <NavigationContainer>
      <Provider>
        <Routes />
      </Provider>
    </NavigationContainer>
  );
}
