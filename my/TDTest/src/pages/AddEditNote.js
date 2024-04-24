import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  Text,
} from "react-native";
import {
  RichText,
  Toolbar,
  useEditorBridge,
  TenTapStartKit,
  CoreBridge,
  DEFAULT_TOOLBAR_ITEMS,
} from "@10play/tentap-editor";
import FontFamilyStylesheet from "../fonts/stylesheet";

// EAF9B2
// 674CE8
const colorGreen = "#EAF9B2";
const colorPurple = "#674CE8";

export default function AddEditNote() {
  const [upToolbar, setUpToolbar] = useState([]);

  useEffect(() => {
    const updatedToolbarItems = DEFAULT_TOOLBAR_ITEMS.map((item, index) => {
      if (index === 0) {
        // bold
        return {
          ...item,
          // image: () => require("./boldActive.png"),
        };
      }
      if (index === 1) {
        // italic
        return {
          ...item,
        };
      }
      // if (index === 2) { // link
      //   return {
      //     ...item,
      //   };
      // }
      // if (index === 3) { // checkbox
      //   return {
      //     ...item,
      //   };
      // }
      // if (index === 4) { // h1, h2
      //   return {
      //     ...item,
      //   };
      // }
      // if (index === 5) { // code
      //   return {
      //     ...item,
      //   };
      // }
      if (index === 6) {
        // underline
        return {
          ...item,
        };
      }
      if (index === 7) {
        // striketrough
        return {
          ...item,
        };
      }
      // if (index === 8) { // quote
      //   return {
      //     ...item,
      //   };
      // }
      if (index === 9) {
        // number list
        return {
          ...item,
        };
      }
      if (index === 10) {
        // bullet list
        return {
          ...item,
        };
      }
      // if (index === 11) {
      //   // >|
      //   return {
      //     ...item,
      //   };
      // }
      // if (index === 12) {
      //   // |<
      //   return {
      //     ...item,
      //   };
      // }
      if (index === 13) {
        // undo
        return {
          ...item,
        };
      }
      if (index === 14) {
        // undo
        return {
          ...item,
        };
      }
      return null;
    }).filter((item) => item !== null);
    setUpToolbar(updatedToolbarItems);
  }, []);

  const customFont = `${FontFamilyStylesheet}* {font-family: 'Merriweather';}`;

  const editor = useEditorBridge({
    // autofocus: true,
    avoidIosKeyboard: true,
    initialContent,
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(customFont), // Custom font
    ],
    theme: {
      toolbar: {
        toolbarBody: {
          // estilo da flatlist
          height: 50,
        },
        toolbarButton: {
          // estilo do touchable opacity
          // backgroundColor: "#f00",
          // padding: 10,
          // paddingHorizontal: 0,
          // marginHorizontal: 3,
        },
        iconWrapper: {
          // estilo da view ao redor do icone
          padding: 5,
          // paddingHorizontal: 15,
          borderRadius: 20,
        },
        iconWrapperActive: {
          // estilo da view quando o icone está ativo
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          // borderRadius: 25,
          // borderWidth: 1,
          // borderColor: "#674CE805",
        },
        iconWrapperDisabled: {
          // estilo da view quando o icone está desativado
        },
        icon: {
          // height: 10,
          // width: 10,
          tintColor: colorPurple,
        },
        iconActive: {
          tintColor: "red",
        },
      },
      webview: {
        // backgroundColor: "#1C1C1E",
      },
    },
  });

  return (
    <SafeAreaView style={exampleStyles.fullScreen}>
      <RichText editor={editor} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={exampleStyles.keyboardAvoidingView}
      >
        <Text>aa</Text>
        <Toolbar editor={editor} items={[...upToolbar]} />
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
