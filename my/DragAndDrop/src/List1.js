import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DraggableFlatList, {
  ScaleDecorator,
  ShadowDecorator,
  OpacityDecorator,
  useOnCellActiveAnimation,
} from "react-native-draggable-flatlist";
import Animated from "react-native-reanimated";

export default function List1() {
  // const ref = useRef(null);
  const [data, setData] = useState([
    {
      key: "1",
      label: "Pinguim Programador",
      backgroundColor: "#1da48a",
    },
    {
      key: "2",
      label: "Gato Gamer",
      backgroundColor: "#ff7f0e",
    },
    {
      key: "3",
      label: "Cachorro Cientista",
      backgroundColor: "#9467bd",
    },
    {
      key: "4",
      label: "Tartaruga Treinadora",
      backgroundColor: "#8c564b",
    },
    {
      key: "5",
      label: "Coelho Criativo",
      backgroundColor: "#e377c2",
    },
    {
      key: "6",
      label: "Raposa Realista",
      backgroundColor: "#7f7f7f",
    },
    {
      key: "7",
      label: "Elefante Empreendedor Empreendedor Empreendedor Empreendedor",
      backgroundColor: "#bcbd22",
    },
    {
      key: "8",
      label: "Leão Líder",
      backgroundColor: "#17becf",
    },
    {
      key: "9",
      label: "Cavalo Curioso",
      backgroundColor: "#d62728",
    },
    {
      key: "10",
      label: "Cobra Criptografada",
      backgroundColor: "#2ca02c",
    },
  ]);

  const renderItem = ({ item, drag }) => {
    const { isActive } = useOnCellActiveAnimation();
    return (
      <ScaleDecorator>
        <OpacityDecorator activeOpacity={0.5}>
          <ShadowDecorator>
            <TouchableOpacity
              onLongPress={drag}
              activeOpacity={1}
              style={[
                styles.rowItem,
                {
                  backgroundColor: item.backgroundColor,
                  // elevation: isActive ? 30 : 0,
                },
              ]}
            >
              {/* <Animated.View> */}
              <Text style={styles.text}>{item.label}</Text>
              {/* </Animated.View> */}
            </TouchableOpacity>
          </ShadowDecorator>
        </OpacityDecorator>
      </ScaleDecorator>
    );
  };

  console.log(data);
  return (
    <GestureHandlerRootView>
      {/* <StatusBar style="auto" /> */}
      <DraggableFlatList
        // ref={ref}
        data={data}
        keyExtractor={(item) => item.key}
        onDragEnd={({ data }) => setData(data)}
        renderItem={renderItem}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  rowItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    padding: 50,
  },
});
