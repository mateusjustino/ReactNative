import { StatusBar } from "expo-status-bar";
import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import ContentLoader, { Circle, Rect } from "react-content-loader/native";
import { useEffect, useState } from "react";

export default function App() {
  const { height, width } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    // setIsLoading(false);
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="transparent" translucent />

      {isLoading ? (
        <ContentLoader
          viewBox={`0 0 ${width} ${height}`}
          backgroundColor="#333"
          foregroundColor="#999"
        >
          <Circle cx="38" cy="38" r="34" />
          <Rect x="90" y="17" rx="4" ry="4" width={30} height={12} />
          <Rect x="90" y="40" rx="4" ry="4" width={200} height={14} />
        </ContentLoader>
      ) : (
        <View style={styles.header}>
          <Image
            source={{ uri: "https://github.com/mateusjustino.png" }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.greeting}>Olá</Text>
            <Text style={styles.username}>Mateus Justino</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 32,
  },
  header: {
    marginTop: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    height: 64,
    width: 64,
    borderRadius: 32,
  },
  greeting: { color: "#fff", fontSize: 14 },
  username: { color: "#fff", fontSize: 14, fontWeight: "bold" },
});
