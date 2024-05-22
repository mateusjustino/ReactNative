import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import moment from "moment-timezone";
import {
  ScaleDecorator,
  ShadowDecorator,
  OpacityDecorator,
} from "react-native-draggable-flatlist";

const NoteList = ({ data, drag }) => {
  const navigation = useNavigation();

  const formatDateTime = (time) => {
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
    } else {
      return `${receivedTime.day()} ${monthName}, ${receivedTime.year()}`;
    }
  };

  return (
    <ScaleDecorator activeScale={1.03}>
      <OpacityDecorator activeOpacity={0.99}>
        <ShadowDecorator>
          <TouchableOpacity
            onLongPress={() => {
              // console.log("asdsd");
              drag();
            }}
            style={{
              borderWidth: 1,
              margin: 10,
              borderRadius: 10,
              backgroundColor: "rgb(240,240,240)",
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
                    <Text style={{ fontStyle: "italic" }}>
                      {" "}
                      {formatDateTime(data.lastEditTime)}
                    </Text>
                  </Text>
                ) : (
                  <Text style={{ fontSize: 12 }}>
                    Created at:
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
