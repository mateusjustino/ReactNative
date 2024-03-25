import { StyleSheet, Text, View } from "react-native";
import { Container, Title } from "./styles";

const Header = () => {
  return (
    <Container>
      <Title>
        Dev<Text style={{ fontStyle: "italic", color: "#e52246" }}>Post</Text>
      </Title>
    </Container>
  );
};

export default Header;

const styles = StyleSheet.create({});
