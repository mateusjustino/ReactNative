import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import {
  ScaleDecorator,
  ShadowDecorator,
  OpacityDecorator,
} from "react-native-draggable-flatlist";
import { UserContext } from "../context/userContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Tags from "./Tags";
import { fontFamily, fontSize } from "../theme/font";
import { iconSize } from "../theme/icon";
import colors from "../theme/colors";

const NoteList = ({ data, drag }) => {
  const navigation = useNavigation();
  const { selectedNotes, setSelectedNotes } = useContext(UserContext);
  const [activeSelected, setActiveSelected] = useState(false);

  useEffect(() => {
    // filtrando as notas que estão selecionadas
    const isActiveSelected = selectedNotes.some((note) => note.id === data.id);
    setActiveSelected(isActiveSelected);
  }, [selectedNotes]);

  const formatDateTime = (time) => {
    const receivedTime = moment(time, "YYYY-MM-DD HH:mm:ss");
    const monthName = receivedTime.format("MMM");

    const now = moment();
    if (receivedTime.year() === now.year()) {
      if (receivedTime.day() === now.day()) {
        return receivedTime.format("HH:mm");
      } else {
        return `${receivedTime.date()} ${monthName}`;
      }
    } else {
      return `${receivedTime.day()} ${monthName}, ${receivedTime.year()}`;
    }
  };

  const controlSelectecNotes = () => {
    let hasItem = false;
    for (let i = 0; i < selectedNotes.length; i++) {
      if (selectedNotes[i].id === data.id) {
        hasItem = true;
        break;
      }
    }
    if (hasItem) {
      // Remover o item do estado
      const updatedNotes = selectedNotes.filter((note) => note.id !== data.id);
      setSelectedNotes(updatedNotes);
    } else {
      // Adicionar o item ao estado
      setSelectedNotes([...selectedNotes, data]);
    }
  };

  return (
    <ScaleDecorator activeScale={0.95}>
      <OpacityDecorator activeOpacity={0.99}>
        <ShadowDecorator>
          <TouchableOpacity
            onLongPress={() => {
              drag();
            }}
            style={{
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: data.backgroundColor,
              borderColor: activeSelected ? "green" : colors.borderColorLight,
              marginBottom: 10,
            }}
            onPress={() =>
              selectedNotes.length !== 0
                ? controlSelectecNotes()
                : navigation.navigate("AddEditNote", {
                    data: data,
                  })
            }
          >
            <View style={{ margin: 10 }}>
              <Text
                style={{
                  fontSize: fontSize.large,
                  fontFamily: fontFamily.PoppinsSemiBold600,
                }}
              >
                {data.title}
              </Text>
            </View>

            <View style={{ margin: 10 }}>
              <Text
                numberOfLines={5}
                style={{
                  fontSize: fontSize.regular,
                  fontFamily: fontFamily.PoppinsRegular400,
                }}
              >
                {data.contentText}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 5,
              }}
            >
              <FlatList
                data={data.tags}
                renderItem={({ item }) => {
                  return <Tags item={item} />;
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginRight: 10 }}
              />
              <View style={{ alignItems: "flex-end", margin: 0 }}>
                {data.lastEditTime ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="clock-edit-outline"
                      size={iconSize.small}
                      color="black"
                    />
                    <Text
                      style={{
                        marginStart: 5,
                        fontSize: fontSize.small,
                        fontFamily: fontFamily.PoppinsRegularItalic400,
                        marginTop: 4,
                      }}
                    >
                      {formatDateTime(data.lastEditTime)}
                    </Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons
                      name="clock-edit-outline"
                      size={iconSize.small}
                      color="black"
                    />
                    <Text
                      style={{
                        marginStart: 5,
                        fontSize: fontSize.small,
                        fontFamily: fontFamily.PoppinsRegularItalic400,
                        marginTop: 4,
                      }}
                    >
                      {formatDateTime(data.createdAt)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </ShadowDecorator>
      </OpacityDecorator>
    </ScaleDecorator>
  );
};

export default NoteList;

const styles = StyleSheet.create({});
