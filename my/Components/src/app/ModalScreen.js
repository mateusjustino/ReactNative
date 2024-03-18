import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import CustomModal from "../components/CustomModal";

const ModalScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState("");

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Abrir Modal" onPress={openModal} />
      <CustomModal
        visible={modalVisible}
        onClose={closeModal}
        PropText={text}
        PropSetText={setText}
      />
      <Text>{text}</Text>
      <Text>{text}</Text>
      <Text>{text}</Text>
      <Text>{text}</Text>
      <Text>{text}</Text>
      <Text>{text}</Text>
      <Text>{text}</Text>
      <Text>{text}</Text>
      <Text>{text}</Text>
      <Text>{text}</Text>
      <Text>{text}</Text>
      <Text>{text}</Text>
    </View>
  );
};

export default ModalScreen;
