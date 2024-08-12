import { StyleSheet, Text, TextInput, View } from "react-native";
import { fontFamily, fontSize } from "../theme/font";
import colors from "../theme/colors";
import { useState } from "react";

const TextInputCustom = ({
  text,
  setText,
  label,
  secure,
  inputMode,
  autoCapitalize,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          value={text}
          onChangeText={(text) => setText(text)}
          style={[
            styles.input,
            {
              borderColor: isFocused
                ? colors.primaryPurpleAlfa
                : colors.borderColorLight,
            },
          ]}
          cursorColor={colors.primaryPurpleAlfa}
          selectionColor={colors.primaryPurpleAlfa}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secure}
          inputMode={inputMode ? inputMode : "text"}
          autoCapitalize={autoCapitalize ? autoCapitalize : "sentences"}
        />
      </View>
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
    fontSize: fontSize.regular,
    paddingStart: 5,
  },
});
