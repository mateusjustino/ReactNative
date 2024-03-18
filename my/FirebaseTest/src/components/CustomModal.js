import React from "react";
import {
  Modal,
  View,
  Text,
  Button,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

const CustomModal = ({ visible, onClose, PropText, PropSetText, PropFunc }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
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
          <View
            style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}
          >
            <Text>coloque a senha antiga</Text>
            <TextInput
              style={{ borderWidth: 1 }}
              value={PropText}
              onChangeText={(text) => PropSetText(text)}
            />
            <Button title="Fechar" onPress={onClose} />
            <Button title="Exec Func" onPress={PropFunc} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomModal;
