import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConnection";

const Database = ({ navigation }) => {
  const [text, setText] = useState("");
  const [listText, setListText] = useState([]);

  useEffect(() => {
    const textRef = collection(db, "textos");
    onSnapshot(textRef, (snapshot) => {
      let lista = [];
      snapshot.forEach((doc) => {
        // console.log(doc.id);
        // console.log(doc.data());
        // console.log(doc.data().text);
        lista.push({
          id: doc.id,
          text: doc.data().text,
        });
      });
      //   console.log(lista);
      setListText(lista);
    });
  }, []);

  const handleAddDoc = async () => {
    await addDoc(collection(db, "textos"), {
      text: text,
    })
      .then(() => {
        alert("deu certo");
        setText("");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <Text>Text:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          padding: 10,
          width: "50%",
          marginBottom: 20,
        }}
        placeholder="Text..."
        value={text}
        onChangeText={(text) => setText(text)}
      />
      <View style={{ marginBottom: 20 }}>
        <Button title="Add Text" onPress={handleAddDoc} />
      </View>

      <FlatList
        data={listText}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, margin: 5 }}>
            <Text style={{ textAlign: "center" }}>{item.text}</Text>
            <View style={{ flexDirection: "row" }}>
              <View style={{ margin: 10 }}>
                <Button title="edit" />
              </View>
              <View style={{ margin: 10 }}>
                <Button title="delete" />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Database;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
