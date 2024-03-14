// ...

// aaaaaaaaaaaaaaaaaaaa
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AScreen from "./tab/AScreen";
import BScreen from "./tab/BScreen";

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="AScreen" component={AScreen} />
      <Tab.Screen name="BScreen" component={BScreen} />
    </Tab.Navigator>
  );
}
