import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MenuScreen from "./src/app/MenuScreen";
import ModalScreen from "./src/app/ModalScreen";

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MenuScreen" component={MenuScreen} />
        <Stack.Screen name="ModalScreen" component={ModalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
