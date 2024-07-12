import { StyleSheet, Text, TextInput, View } from "react-native";
import { fontFamily, fontSize } from "../theme/font";
import colors from "../theme/colors";

const TextInputCustom = ({ text, setText, placeholder, label }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={text}
        onChangeText={(text) => setText(text)}
        style={styles.input}
        placeholder={placeholder}
        cursorColor={colors.primaryBlue}
        selectionColor={colors.primaryBlue}
      />
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
    borderColor: colors.borderColorLight,
    paddingTop: 10,
    paddingBottom: 7,
  },
  label: {
    fontFamily: fontFamily.PoppinsRegular400,
    fontSize: fontSize.small,
    paddingStart: 5,
  },
});
