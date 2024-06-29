import { ActivityIndicator, StyleSheet } from "react-native";
import colors from "../theme/colors";

const Loading = () => {
  return <ActivityIndicator size="small" color={colors.primaryBlue} />;
};

export default Loading;

const styles = StyleSheet.create({});
