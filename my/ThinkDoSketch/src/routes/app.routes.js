import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../pages/Home";
import AddEditNote from "../pages/AddEditNote";
import Welcome from "../pages/Welcome";
import Test from "../pages/Test";

const Stack = createStackNavigator();

const AppRoutes = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        // headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          ...TransitionPresets.RevealFromBottomAndroid,
        }}
      />
      <Stack.Screen name="AddEditNote" component={AddEditNote} />
      <Stack.Screen name="Test" component={Test} />
    </Stack.Navigator>
  );
};

export default AppRoutes;
