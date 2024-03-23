import { StyleSheet, Text, View, ActivityIndicator } from "react-native";

import {
  Container,
  Title,
  Input,
  Button,
  ButtonText,
  SignUpButton,
  SignUpText,
} from "./styles";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/auth";

const Login = () => {
  const [login, setLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, signIn, loadingAuth } = useContext(AuthContext);

  function toggleLogin() {
    setName("");
    setEmail("");
    setPassword("");
    setLogin(!login);
  }

  async function handleSignIn() {
    if (email === "" || password === "") {
      alert("Preencha todos os campos");
      return;
    }
    await signIn(email, password);
  }

  async function handleSignUp() {
    if (name === "" || email === "" || password === "") {
      alert("Preencha todos os campos");
      return;
    }
    await signUp(email, password, name);
  }

  if (login) {
    return (
      <Container>
        <Title>
          Dev
          <Text style={{ color: "#e52246" }}>Post</Text>
        </Title>
        <Input
          placeholder="seuemail@teste.com"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="******"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Button onPress={handleSignIn}>
          {loadingAuth ? (
            <ActivityIndicator size={20} color="#fff" />
          ) : (
            <ButtonText>Acessar</ButtonText>
          )}
        </Button>
        <SignUpButton onPress={toggleLogin}>
          <SignUpText>Criar uma conta</SignUpText>
        </SignUpButton>
      </Container>
    );
  }
  return (
    <Container>
      <Title>
        Dev
        <Text style={{ color: "#e52246" }}>Post</Text>
      </Title>
      <Input
        placeholder="Seu nome"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <Input
        placeholder="seuemail@teste.com"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Input
        placeholder="******"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button onPress={handleSignUp}>
        <ButtonText>
          {loadingAuth ? (
            <ActivityIndicator size={20} color="#fff" />
          ) : (
            <ButtonText>Cadastrar</ButtonText>
          )}
        </ButtonText>
      </Button>
      <SignUpButton onPress={toggleLogin}>
        <SignUpText>Ja tenho uma conta</SignUpText>
      </SignUpButton>
    </Container>
  );
};

export default Login;

const styles = StyleSheet.create({});
