import { useEffect, useRef, useState } from "react";
import {
  Text,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  View,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";

import { FontAwesome5 } from "@expo/vector-icons";

const colorGreen = "#EAF9B2";
const colorPurple = "#674CE8";

const iconBold = ({ tintColor }) => (
  <FontAwesome5 name="bold" color={tintColor} size={24} />
);

const iconItalic = ({ tintColor }) => (
  <FontAwesome5 name="italic" color={tintColor} size={24} />
);

const iconUnderline = ({ tintColor }) => (
  <FontAwesome5 name="underline" color={tintColor} size={24} />
);

const TempScreen = () => {
  const richText = useRef();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isContentFocus, setIsContentFocus] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardOpen(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardOpen(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: "white" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, backgroundColor: "white" }}
        >
          <Text>title:</Text>
          <TextInput
            style={{ padding: 10, borderWidth: 1 }}
            onFocus={() => setIsContentFocus(false)}
          />
          <Text>content:</Text>
          <RichEditor
            ref={richText}
            onChange={(descriptionText) => {
              console.log("descriptionText:", descriptionText);
            }}
            placeholder="placeholder..."
            style={{ flex: 1 }}
            editorStyle={{ backgroundColor: "red" }}
            onFocus={() => setIsContentFocus(true)}
          />
        </KeyboardAvoidingView>
      </ScrollView>
      <RichToolbar
        editor={richText}
        actions={[actions.setBold, actions.setItalic, actions.setUnderline]}
        iconMap={{
          [actions.setBold]: iconBold,
          [actions.setItalic]: iconItalic,
          [actions.setUnderline]: iconUnderline,
        }}
        // unselectedButtonStyle={{ backgroundColor: "red" }} // possui style da view, para icone nao selecionados
        // selectedButtonStyle={{ backgroundColor: "green" }} // possui style da view, para icone selecionados
        selectedIconTint={colorGreen} // cor do item selecionado
        iconTint={colorPurple} // cor do icone em si
        style={
          isKeyboardOpen && isContentFocus
            ? {
                backgroundColor: "white",
                // height: 100,
              }
            : { display: "none" }
        }
        flatContainerStyle={{
          backgroundColor: "white",
          // marginBottom: 10,
        }}
        // disabled={isContentFocus}
      />
    </SafeAreaView>
  );
};

export default TempScreen;
