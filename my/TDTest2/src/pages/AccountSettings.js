import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import Header from "../components/Header";
import colors from "../theme/colors";
import TextInputCustom from "../components/TextInputCustom";

const AccountSettings = () => {
  const [text, setText] = useState("");
  return (
    <>
      <Header fromSettings />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <TextInputCustom text={text} setText={setText} placeholder="teste" />
        <Text>verificação de email</Text>
        <Text>atualizar o nome</Text>
        <Text>atualizar o email</Text>
        <Text>atualizar a senha</Text>
        <Text>
          enviar email para atualizar senha (isso posso colocar no login, em
          esqueceu a senha)
        </Text>
      </ScrollView>
    </>
  );
};

export default AccountSettings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLight,
    padding: 10,
  },
});
