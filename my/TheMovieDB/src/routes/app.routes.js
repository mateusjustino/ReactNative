import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../pages/Home";
import Movie from "../pages/Movie";
import Search from "../pages/Search";
const Stack = createNativeStackNavigator();

const Routes = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        // headerShown: false,
        // animationTypeForReplace: "pop",
        animation: "fade",
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Movie" component={Movie} />
      <Stack.Screen name="Search" component={Search} />
    </Stack.Navigator>
  );
};

export default Routes;
