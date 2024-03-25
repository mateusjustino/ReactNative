import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, {
  useLayoutEffect,
  useState,
  useCallback,
  useContext,
} from "react";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { db } from "../../firebaseConnection";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import PostList from "../../components/PostsList";
import { Container, ListPosts } from "./styles";
import { AuthContext } from "../../contexts/auth";

const PostsUser = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState(route.params?.title);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title === "" ? "" : title,
    });
  }, [navigation, title]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function getPosts() {
        const q = query(
          collection(db, "posts"),
          where("userId", "==", route.params?.userId),
          orderBy("created", "desc")
        );
        const querySnapshot = await getDocs(q);

        const postList = [];

        querySnapshot.forEach((doc) => {
          postList.push({
            ...doc.data(),
            id: doc.id,
          });
        });

        if (isActive) {
          setPosts(postList);
          setLoading(false);
        }
      }
      getPosts();

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <Container>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={50} color="#e52246" />
        </View>
      ) : (
        <ListPosts
          showsVerticalScrollIndicator={false}
          data={posts}
          renderItem={({ item }) => <PostList data={item} userId={user.uid} />}
        />
      )}
    </Container>
  );
};

export default PostsUser;

const styles = StyleSheet.create({});
