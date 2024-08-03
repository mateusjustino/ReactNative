import { StyleSheet, Text, TextInput, View } from "react-native";
import { fontFamily, fontSize } from "../theme/font";
import colors from "../theme/colors";
import { useState } from "react";

const TextInputCustom = ({ text, setText, placeholder, label }) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={text}
        onChangeText={(text) => setText(text)}
        style={[
          styles.input,
          {
            borderColor: isFocused
              ? colors.primaryPurple
              : colors.borderColorLight,
          },
        ]}
        placeholder={placeholder}
        cursorColor={colors.primaryPurple}
        selectionColor={colors.primaryPurple}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {/* <Text>
        {isFocused ? "TextInput está ativo" : "TextInput está inativo"}
      </Text> */}
    </View>
  );
};

export default TextInputCustom;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    fontFamily: fontFamily.PoppinsRegular400,
    paddingHorizontal: 15,
    width: "100%",
    fontSize: fontSize.regular,
    // borderColor: colors.borderColorLight,
    paddingTop: 10,
    paddingBottom: 7,
  },
  label: {
    fontFamily: fontFamily.PoppinsRegular400,
    fontSize: fontSize.small,
    paddingStart: 5,
  },
});
