import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../pages/Home";
import AddEditNote from "../pages/AddEditNote";
import Welcome from "../pages/Welcome";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConnection";
import Loading from "../components/Loading";
import { UserContext } from "../context/userContext";
import Settings from "../pages/Settings";

const Stack = createNativeStackNavigator();

const AppRoutes = () => {
  const [userAuth, setUserAuth] = useState(null);
  const { user, setUser, EnterUser } = useContext(UserContext);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // setUser(user);
        EnterUser(user);
        setUserAuth(true);
      } else {
        // setUser({});
        setUserAuth(false);
      }
    });

    return () => unsub();
  }, []);

  if (userAuth === null) {
    return <Loading />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        animation: "fade_from_bottom",
        headerShown: false,
      }}
      initialRouteName={userAuth ? "Home" : "SignIn"}
    >
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="AddEditNote"
        component={AddEditNote}
        // options={{
        //   animation: "slide_from_right",
        // }}
      />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};

export default AppRoutes;
