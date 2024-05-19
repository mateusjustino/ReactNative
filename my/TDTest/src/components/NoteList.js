import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/userContext";
import moment from "moment-timezone";
import DraggableFlatList, {
  ScaleDecorator,
  ShadowDecorator,
  OpacityDecorator,
  useOnCellActiveAnimation,
} from "react-native-draggable-flatlist";

const NoteList = ({ data, drag }) => {
  const navigation = useNavigation();
  const [dateTime, setDateTime] = useState("");
  // const { timezone } = useContext(UserContext);

  const formatDateTime = (time) => {
    // Cria um objeto Moment a partir da data e hora recebida
    const receivedTime = moment(time, "YYYY-MM-DD HH:mm:ss");
    const monthName = receivedTime.format("MMM");

    // Cria um objeto Moment para o momento atual
    const now = moment();

    if (receivedTime.year() === now.year()) {
      if (receivedTime.day() === now.day()) {
        return receivedTime.format("HH:mm");
      } else {
        return `${receivedTime.date()} ${monthName}`;
      }
      // return "mesmo ano";
    } else {
      return `${receivedTime.day()} ${monthName}, ${receivedTime.year()}`;
    }

    // Retorna true se for o mesmo ano, false caso contrário
    // return isSameYear;
  };

  return (
    <ScaleDecorator activeScale={1.03}>
      <OpacityDecorator activeOpacity={0.9}>
        <ShadowDecorator>
          <TouchableOpacity
            onLongPress={drag}
            style={{
              borderWidth: 1,
              margin: 10,
              borderRadius: 10,
              // backgroundColor: "red",
            }}
            onPress={() =>
              navigation.navigate("AddEditNote", {
                data: data,
              })
            }
          >
            <View style={{ margin: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {data.title}
              </Text>
            </View>
            <View style={{ margin: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                Order: {data.order}
              </Text>
            </View>

            <View style={{ margin: 10 }}>
              <Text numberOfLines={5} style={{ lineHeight: 20 }}>
                {data.contentText}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FlatList
                data={data.tags}
                renderItem={({ item }) => {
                  return (
                    <View
                      style={{
                        margin: 10,
                        backgroundColor: "#aaa",
                        paddingVertical: 3,
                        paddingHorizontal: 10,
                        borderRadius: 5,
                      }}
                    >
                      <Text>{item}</Text>
                    </View>
                  );
                }}
                horizontal
              />
              <View style={{ alignItems: "flex-end", margin: 10 }}>
                {data.lastEditTime ? (
                  <Text style={{ fontSize: 12 }}>
                    Last time edited:
                    {/* <Text style={{ fontStyle: "italic" }}>
                    {" "}
                    {data.lastEditTime}
                  </Text> */}
                    <Text style={{ fontStyle: "italic" }}>
                      {" "}
                      {formatDateTime(data.lastEditTime)}
                    </Text>
                  </Text>
                ) : (
                  <Text style={{ fontSize: 12 }}>
                    Created at:
                    {/* <Text style={{ fontStyle: "italic" }}>{data.createdAt}</Text> */}
                    <Text style={{ fontStyle: "italic" }}>
                      {" "}
                      {formatDateTime(data.createdAt)}
                    </Text>
                  </Text>
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
