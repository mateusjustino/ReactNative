import React from "react";
import {
  Modal,
  View,
  Text,
  Button,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";

const CustomModal = ({ visible, onClose, PropText, PropSetText }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose} // Esta propriedade irá fechar o modal quando o usuário clicar no botão de voltar do dispositivo
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <Text>Seu conteúdo do modal aqui</Text>
              <TextInput
                value={PropText}
                onChangeText={(text) => PropSetText(text)}
                style={{ borderWidth: 1 }}
              />
              <Button title="Fechar" onPress={onClose} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomModal;
