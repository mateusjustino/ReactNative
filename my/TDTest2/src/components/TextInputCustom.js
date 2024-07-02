import { StyleSheet, Text, TextInput, View } from "react-native";
import { fontFamily, fontSize } from "../theme/font";
import colors from "../theme/colors";

const TextInputCustom = ({ text, setText, placeholder }) => {
  return (
    <TextInput
      value={text}
      onChangeText={(text) => setText(text)}
      style={styles.input}
      placeholder={placeholder}
      cursorColor={colors.primaryBlue}
      selectionColor={colors.primaryBlue}
    />
  );
};

export default TextInputCustom;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    fontFamily: fontFamily.PoppinsRegular400,
    paddingHorizontal: 15,
    width: "100%",
    fontSize: fontSize.regular,
    borderColor: colors.borderColorLight,
    paddingTop: 10,
    paddingBottom: 7,
  },
});
