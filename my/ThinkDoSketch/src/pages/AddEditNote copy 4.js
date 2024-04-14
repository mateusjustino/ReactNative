import React from "react";
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import {
  CoreBridge,
  RichText,
  TenTapStartKit,
  Toolbar,
  useEditorBridge,
  darkEditorCss,
  darkEditorTheme,
} from "@10play/tentap-editor";
import FontFamilyStylesheet from "../fonts/stylesheet";

export default function Basic() {
  const customFont = `
${FontFamilyStylesheet}
* {
    font-family: 'Merriweather';
}
`;

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent,
    // bridgeExtensions: [
    //   ...TenTapStartKit,
    //   CoreBridge.configureCSS(darkEditorCss), // <--- Add our dark mode css
    // ],
    // theme: darkEditorTheme, // <-- Add our dark mode theme
    bridgeExtensions: [
      // It is important to spread StarterKit BEFORE our extended plugin,
      // as plugin duplicated will be ignored
      ...TenTapStartKit,
      CoreBridge.configureCSS(customFont), // Custom font
      CoreBridge.configureCSS(darkEditorCss),
    ],
    theme: darkEditorTheme,
  });

  return (
    <SafeAreaView style={exampleStyles.fullScreen}>
      <RichText editor={editor} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={exampleStyles.keyboardAvoidingView}
      >
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const exampleStyles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  keyboardAvoidingView: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
});

const initialContent = `<p>This is a basic example!</p>`;
