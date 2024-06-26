import { ActivityIndicator, View } from "react-native";
import React from "react";
import colors from "../theme/colors";

const Loading = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.backgroundLight,
      }}
    >
      <ActivityIndicator size="large" color="black" />
    </View>
  );
};

export default Loading;
