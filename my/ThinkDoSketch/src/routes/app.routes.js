import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../pages/Home";
import AddEditNote from "../pages/AddEditNote";
import Welcome from "../pages/Welcome";
import Test from "../pages/Test";

const Stack = createNativeStackNavigator();

const AppRoutes = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="AddEditNote" component={AddEditNote} />
      <Stack.Screen name="Test" component={Test} />
    </Stack.Navigator>
  );
};

export default AppRoutes;
