import { View, Button } from "react-native";

const MenuScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        title="ModalScreen Default ReactNative"
        onPress={() => navigation.navigate("ModalScreen")}
      />
    </View>
  );
};

export default MenuScreen;
