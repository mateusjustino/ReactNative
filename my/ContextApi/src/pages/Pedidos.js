import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { Context } from "../contexts/context";

const Pedidos = () => {
  const { nome } = useContext(Context);
  return (
    <View style={styles.container}>
      <Text>Pedidos</Text>
      <Text>{nome}</Text>
    </View>
  );
};

export default Pedidos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
