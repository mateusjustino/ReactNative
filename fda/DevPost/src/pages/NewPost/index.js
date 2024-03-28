import { Container, Input, Button, ButtonText } from "./styles";
import { useState, useLayoutEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { db, storage } from "../../firebaseConnection";
import { getDownloadURL, ref } from "firebase/storage";
import { addDoc, collection, doc } from "firebase/firestore";

import { AuthContext } from "../../contexts/auth";

const DevPost = () => {
  const navigation = useNavigation();
  const [post, setPost] = useState("");
  const { user } = useContext(AuthContext);

  useLayoutEffect(() => {
    const options = navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => handlePost()}>
          <ButtonText>Compartilhar</ButtonText>
        </Button>
      ),
    });
  }, [navigation, post]);

  async function handlePost() {
    if (post === "") {
      alert("Post vazio");
      return;
    }

    let urlImg = null;
    try {
      const storageRef = ref(storage, "users/" + user?.uid);
      getDownloadURL(storageRef).then((linkUrl) => {
        urlImg = linkUrl;
      });
    } catch (error) {
      urlImg = null;
    }

    await addDoc(collection(db, "posts"), {
      created: new Date(),
      content: post,
      autor: user?.nome,
      userId: user?.uid,
      likes: 0,
      avatarUrl: urlImg,
    })
      .then(() => {
        setPost("");
        alert("Post criado com sucesso");
      })
      .catch((error) => alert(error.message));

    navigation.goBack();
  }

  return (
    <Container>
      <Input
        placeholder="O que está acontecendo?"
        value={post}
        onChangeText={(text) => setPost(text)}
        autoCorrect={false}
        multiline={true}
        placeholderTextColor="#ddd"
        maxLength={300}
      />
    </Container>
  );
};

export default DevPost;
