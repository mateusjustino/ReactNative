import { ActivityIndicator, StyleSheet } from "react-native";
import colors from "../theme/colors";

const Loading = ({ color }) => {
  return (
    <ActivityIndicator
      size="small"
      color={color ? color : colors.primaryGreen}
    />
  );
};

export default Loading;

const styles = StyleSheet.create({});
