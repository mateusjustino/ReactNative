import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import AScreen from "./tab/AScreen";
import BScreen from "./tab/BScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createMaterialBottomTabNavigator();

export default function MaterialTab() {
  return (
    <Tab.Navigator
      activeColor="#e91e63"
      barStyle={{ backgroundColor: "tomato" }}
    >
      <Tab.Screen
        name="AScreen"
        component={AScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="BScreen"
        component={BScreen}
        options={{
          tabBarLabel: "Updates",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
