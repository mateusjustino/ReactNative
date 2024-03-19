import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/pages/Login";
import Home from "./src/pages/Home";
import Pedidos from "./src/pages/Pedidos";

import Provider from "./src/contexts/context";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Provider>
        <Stack.Navigator>
          <Stack.Screen component={Login} name="Login" />
          <Stack.Screen component={Home} name="Home" />
          <Stack.Screen component={Pedidos} name="Pedidos" />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
}
