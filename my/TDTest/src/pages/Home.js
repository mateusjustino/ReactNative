import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import NoteList from "../components/NoteList";
import { db } from "../firebaseConnection";
import { collection, onSnapshot } from "firebase/firestore";
import FavButton from "../components/FavButton";
import Header from "../components/Header";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onSnapshot(collection(db, "notes"), (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          title: doc.data().title,
          contentText: doc.data().contentText,
          contentHTML: doc.data().contentHTML,
          createdAt: doc.data().createdAt,
          lastEditTime: doc.data().lastEditTime,
        });
      });
      setNotes(list);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }
  return (
    <>
      <Header showContent />
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ margin: 20, flexDirection: "row" }}>
            <View style={styles.tag} />
            <View style={styles.tag} />
            <View style={styles.tag} />
            <View style={styles.tag} />
          </View>

          <FlatList
            keyExtractor={(item) => item.id}
            data={notes}
            renderItem={({ item }) => <NoteList data={item} />}
            scrollEnabled={false}
          />
        </ScrollView>
        <View style={{ alignItems: "center" }}>
          <FavButton style={styles.favButton} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tag: {
    width: 35,
    height: 20,
    backgroundColor: "gray",
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
    marginEnd: 20,
  },
  favButton: {
    position: "absolute",
    bottom: 20,
  },
});

export default Home;
