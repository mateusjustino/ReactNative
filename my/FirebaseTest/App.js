import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from "./src/app/SignIn";
import SignUp from "./src/app/SignUp";
import MainApp from "./src/app/MainApp";
import VerifyEmail from "./src/app/VerifyEmail";
import UpdateProfile from "./src/app/UpdateProfile";
import PasswordReset from "./src/app/PasswordReset";
import UpdateEmail from "./src/app/UpdateEmail";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="MainApp" component={MainApp} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
        <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
        <Stack.Screen name="UpdateEmail" component={UpdateEmail} />
        <Stack.Screen name="PasswordReset" component={PasswordReset} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
