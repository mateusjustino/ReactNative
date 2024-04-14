import React, { useEffect, useState } from "react";
import {
  Text,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Button,
  StyleSheet,
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { Fontisto } from "@expo/vector-icons";
import FontFamilyStylesheet from "../fonts/stylesheet";

const handleHead = ({ tintColor }) => (
  <Text style={{ color: tintColor }}>H66</Text>
);
const handleBold = ({ tintColor }) => (
  <Fontisto name="bold" size={24} color="black" />
);
const handleConsole = ({ tintColor }) => (
  <Fontisto name="react" size={24} color="black" />
);
const handleConsoleAction = () => console.log("teste");

const AddEditNote = () => {
  const richText = React.useRef();
  const [content, setContent] = useState("");

  const fontFamily = "Merriweather";
  const initialCSSText = {
    initialCSSText: `${FontFamilyStylesheet}`,
    contentCSSText: `font-family: ${fontFamily}`,
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Text>Description:</Text>
          <Text style={{ fontFamily: "MerriweatherRegular" }}>
            content inicial
          </Text>
          <Text>content inicial</Text>
          <RichEditor
            ref={richText}
            onChange={(descriptionText) => {
              setContent(descriptionText);
            }}
            initialContentHTML="content inicial"
            // editorStyle={{
            //   backgroundColor: "#cccc00",
            //   color: "#333300",
            //   caretColor: "red",
            //   // contentCSSText: "font-size: 42px; font-family: ''",
            // }}
            editorStyle={initialCSSText}
          />
        </KeyboardAvoidingView>
      </ScrollView>

      <RichToolbar
        editor={richText}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.checkboxList,
          actions.heading1,
          actions.undo,
          actions.redo,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.setStrikethrough,
          "showConsole",
        ]}
        iconMap={{
          [actions.heading1]: handleHead,
          [actions.setBold]: handleBold,
          showConsole: handleConsole,
        }}
        showConsole={handleConsoleAction}
        // iconTint="red"
        selectedIconTint="red"
        selectedButtonStyle={{
          backgroundColor: "lightblue",
          borderRadius: 10,
        }}
        unselectedButtonStyle={{
          backgroundColor: "lightgreen",
          borderRadius: 10,
        }}
        style={{
          backgroundColor: "lightsalmon",
          // flexDirection: "row",
        }}
      />
      <Button
        title="Show value"
        onPress={() => {
          console.log(content);
        }}
      />
      {/* <Fontisto name="bold" size={24} color="black" /> */}
    </SafeAreaView>
  );
};

export default AddEditNote;

const styles = StyleSheet.create({});
