import { StyleSheet, Text, ActivityIndicator, View } from "react-native";
import { Container, ButtonPost, ListPosts } from "./styles";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Header from "../../components/Header";
import { useCallback, useContext, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import { db } from "../../firebaseConnection";
import {
  collection,
  query,
  orderBy,
  getDocs,
  limit,
  startAfter,
} from "firebase/firestore";
import PostList from "../../components/PostsList";

const Home = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [lastItem, setLastItem] = useState("");
  const [emptyList, setEmptyList] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function fetchPosts() {
        const q = query(
          collection(db, "posts"),
          orderBy("created", "desc"),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        if (isActive) {
          setPosts([]);
          const postList = [];

          querySnapshot.forEach((doc) => {
            postList.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          setEmptyList(!!querySnapshot.empty);
          setPosts(postList);
          // setLastItem(postList[postList.length - 1]);
          setLastItem(querySnapshot.docs[querySnapshot.docs.length - 1]);
          setLoading(false);
        }
      }

      fetchPosts();

      return () => {
        isActive = false;
      };
    }, [])
  );

  async function handleRefreshPosts() {
    setLoadingRefresh(true);

    async function fetchPosts() {
      const q = query(
        collection(db, "posts"),
        orderBy("created", "desc"),
        limit(5)
      );

      const querySnapshot = await getDocs(q);
      setPosts([]);
      const postList = [];

      querySnapshot.forEach((doc) => {
        postList.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setEmptyList(false);
      setPosts(postList);
      // setLastItem(postList[postList.length - 1]);
      setLastItem(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setLoading(false);
    }
    fetchPosts();
    setLoadingRefresh(false);
  }

  async function getListPosts() {
    if (emptyList) {
      setLoading(false);
      return null;
    }

    if (loading) return;

    async function fetchPosts() {
      const q = query(
        collection(db, "posts"),
        orderBy("created", "desc"),
        startAfter(lastItem),
        limit(5)
      );

      const querySnapshot = await getDocs(q);
      const postList = [];

      querySnapshot.forEach((doc) => {
        // console.log(doc.data());
        postList.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setEmptyList(!!querySnapshot.empty);
      // setLastItem(postList[postList.length - 1]);
      setLastItem(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setPosts((oldPosts) => [...oldPosts, ...postList]);
      setLoading(false);
    }
    fetchPosts();
  }

  return (
    <Container>
      <Header />

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
          renderItem={({ item }) => <PostList data={item} userId={user?.uid} />}
          refreshing={loadingRefresh}
          onRefresh={handleRefreshPosts}
          onEndReached={() => getListPosts()}
          onEndReachedThreshold={0.1}
        />
      )}

      <ButtonPost
        activeOpacity={0.8}
        onPress={() => navigation.navigate("NewPost")}
      >
        <Feather name="edit-2" color="#fff" size={25} />
      </ButtonPost>
    </Container>
  );
};

export default Home;

const styles = StyleSheet.create({});
