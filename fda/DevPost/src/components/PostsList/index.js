import { Text, View } from "react-native";
import {
  Container,
  Name,
  Header,
  Avatar,
  ContentView,
  Content,
  Actions,
  LikeButton,
  Like,
  TimePost,
} from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import { db } from "../../firebaseConnection";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const PostList = ({ data, userId }) => {
  const [likePost, setLikePost] = useState(data?.likes);

  async function handleLikePost(id, likes) {
    const docId = `${userId}_${id}`;

    const docRef = doc(db, "likes", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      const docRefPost = doc(db, "posts", id);
      await updateDoc(docRefPost, {
        likes: likes - 1,
      });

      await deleteDoc(doc(db, "likes", docId)).then(() =>
        setLikePost(likes - 1)
      );
      return;
    }

    await setDoc(doc(db, "likes", docId), {
      postId: id,
      userId: userId,
    })
      .then(() => alert("foi"))
      .catch((error) => alert(error.message));

    const docRefPost = doc(db, "posts", id);
    await updateDoc(docRefPost, {
      likes: likes + 1,
    }).then(() => setLikePost(likes + 1));

    // const doc = await Firestore().collection('likes').doc(docId).get()
  }

  function formatTimePost() {
    const datePost = new Date(data.created.seconds * 1000);

    return formatDistance(new Date(), datePost, { locale: ptBR });
  }

  return (
    <Container>
      <Header>
        {data.avatarUrl ? (
          <Avatar source={{ uri: data.avatarUrl }} />
        ) : (
          <Avatar source={require("../../assets/avatar.png")} />
        )}

        <Name numberOfLines={1}>{data?.autor}</Name>
      </Header>

      <ContentView>
        <Content>{data?.content}</Content>
      </ContentView>

      <Actions>
        <LikeButton onPress={() => handleLikePost(data.id, likePost)}>
          <Like>{likePost === 0 ? "" : likePost}</Like>
          <MaterialCommunityIcons
            name={likePost === 0 ? "heart-plus-outline" : "cards-heart"}
            size={20}
            color="#e52246"
          />
        </LikeButton>
        <TimePost>{formatTimePost()}</TimePost>
      </Actions>
    </Container>
  );
};

export default PostList;
