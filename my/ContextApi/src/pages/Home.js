import { useContext } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { Context } from "../contexts/context";

const Home = ({ navigation }) => {
  const { email } = useContext(Context);
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Text>Email: {email}</Text>

      <Button
        title="Acessar pedidos"
        onPress={() => navigation.navigate("Pedidos")}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
