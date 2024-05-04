import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  Text,
  View,
  ActivityIndicator,
  Button,
  Alert,
  TextInput,
} from "react-native";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import {
  RichText,
  Toolbar,
  useEditorBridge,
  TenTapStartKit,
  CoreBridge,
  DEFAULT_TOOLBAR_ITEMS,
  PlaceholderBridge,
} from "@10play/tentap-editor";
import FontFamilyStylesheet from "../fonts/stylesheet";
import Header from "../components/Header";
import { db } from "../firebaseConnection";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

// EAF9B2
// 674CE8
const colorGreen = "#EAF9B2";
const colorPurple = "#674CE8";

export default function AddEditNote() {
  const navigation = useNavigation();
  const route = useRoute();
  const data = route.params?.data;

  const [title, setTitle] = useState(data ? data.title : "");

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = navigation.addListener("beforeRemove", () => {
        // Aqui você pode executar a lógica quando o usuário está tentando voltar
        // por exemplo, exibir um alerta, mostrar um modal de confirmação, etc.
        // Se você retornar false aqui, a ação de voltar será cancelada.
        console.log("retornou");
        // Retorne true para permitir que a tela seja removida

        return true;
      });

      return unsubscribe;
    }, [navigation])
  );

  const [upToolbar, setUpToolbar] = useState([]);

  useEffect(() => {
    // setIsLoading(true);
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
    // setIsLoading(false);
  }, []);

  const customFont = `${FontFamilyStylesheet}* {font-family: 'Merriweather';}`;
  const editor = useEditorBridge({
    // autofocus: true,
    avoidIosKeyboard: true,
    initialContent: data ? data.contentHTML : "",
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(customFont), // Custom font
      PlaceholderBridge.configureExtension({
        placeholder: "Type something...", // placeholder
      }),
    ],
    // onChange: () => {
    //   console.log("aa");
    // },
    // isReady: () => setIsLoading(false),
    // isFocused: console.log("focado no edito"),
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
          backgroundColor: "rgba(0, 0, 0, 0)",
          // backgroundColor: colorGreen,
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
          tintColor: colorGreen,
        },
      },
      webview: {
        backgroundColor: "rgb(200,255,200)",
        backgroundColor: "transparent",
        // margin: 10,
        // borderRadius: 10,
      },
    },
  });

  const handleAdd = async () => {
    const actualHTML = await editor.getHTML();
    const actualText = await editor.getText();

    await addDoc(collection(db, "notes"), {
      title: title,
      contentText: actualText,
      contentHTML: actualHTML,
      createdAt: "34/64/5423",
      lastEditTime: null,
    })
      .then(() => navigation.goBack())
      .catch((error) => console.log(error.message));
  };

  const handleUpdate = async () => {
    const actualHTML = await editor.getHTML();
    const actualText = await editor.getText();

    const noteRef = doc(db, "notes", data.id);
    await updateDoc(noteRef, {
      title: title,
      contentText: actualText,
      contentHTML: actualHTML,
    })
      .then(() => navigation.goBack())
      .catch((error) => console.log(error.message));
  };

  return (
    <>
      <Header showContent />
      <View style={styles.fullScreen}>
        {data ? (
          <Button title="save" onPress={handleUpdate} />
        ) : (
          <Button title="add" onPress={handleAdd} />
        )}
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <View
          style={{
            flex: 1,
            borderRadius: 10,
            overflow: "hidden",
            padding: 10,
            borderWidth: 1,
            margin: 10,
          }}
        >
          <RichText editor={editor} />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <Toolbar editor={editor} items={[...upToolbar]} />
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: "rgb(200,255,200)",
    // padding: 10,
  },
  keyboardAvoidingView: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
  input: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    margin: 10,
  },
});
