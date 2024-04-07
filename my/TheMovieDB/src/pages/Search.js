import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import api from "../services/api";
import { useNavigation } from "@react-navigation/native";

const Search = () => {
  const navigation = useNavigation();
  const [input, setInput] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null); // Ref para a FlatList

  const handleSearch = async () => {
    if (loading) return;
    setLoading(true);
    setSearchList([]);
    setPage(1);
    try {
      const response = await api.get(
        `https://api.themoviedb.org/3/search/movie?include_adult=false`,
        {
          params: {
            api_key: "6876ef12b2f4338d57e35ac8d4f4faf8",
            page: 1,
            query: input,
            language: "en-US",
            sort_by: "popularity.desc",
          },
        }
      );
      const responseList = response.data.results;
      const newList = responseList.filter((element) => element.poster_path);
      setSearchList(newList);
      setPage(2);
      scrollToTop(); // Rolando para o início da lista após a nova pesquisa
    } catch (error) {
      console.error("Ocorreu um erro ao buscar filmes:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMovies = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await api.get(
        `https://api.themoviedb.org/3/search/movie?include_adult=false`,
        {
          params: {
            api_key: "6876ef12b2f4338d57e35ac8d4f4faf8",
            page: page,
            query: input,
            language: "en-US",
            sort_by: "popularity.desc",
          },
        }
      );
      const newMovies = response.data.results.filter(
        (movie) =>
          movie.poster_path && !searchList.find((m) => m.id === movie.id)
      );
      setSearchList((prevMovies) => [...prevMovies, ...newMovies]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Ocorreu um erro ao carregar mais filmes:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  };

  return (
    <View>
      <TextInput
        placeholder="search..."
        value={input}
        onChangeText={(text) => setInput(text)}
      />
      <Button title="pesquisar" onPress={handleSearch} disabled={loading} />
      <FlatList
        ref={flatListRef} // Associando a ref da FlatList
        data={searchList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) =>
          item.poster_path && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Movie", {
                  id: item.id,
                })
              }
              style={{
                marginVertical: 10,
                marginHorizontal: 10,
                alignItems: "center",
                justifyContent: "center",
                width: 120,
              }}
              key={item.id}
            >
              <Text>{item.title}</Text>
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
                }}
                style={{ height: 100, width: 100 }}
              />
            </TouchableOpacity>
          )
        }
        numColumns={2}
        onEndReached={loadMoreMovies}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({});
