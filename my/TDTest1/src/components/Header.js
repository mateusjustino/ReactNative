import {
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";

export default function Header({ showContent }) {
  return (
    <SafeAreaView style={styles.container}>
      {showContent && (
        <>
          <Text>Header</Text>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
