import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import api from "../services/api";
import YouTubeIframe from "react-native-youtube-iframe";

const Movie = ({ route }) => {
  const movie_id = route.params?.id;
  console.log(movie_id);

  const [movieData, setMovieData] = useState([]);
  const [trailerKey, setTrailerKey] = useState("");
  const [actors, setActors] = useState([]);

  useEffect(() => {
    async function loadData() {
      const response = await api.get(
        `https://api.themoviedb.org/3/movie/${movie_id}`,
        {
          params: {
            api_key: "6876ef12b2f4338d57e35ac8d4f4faf8",
          },
        }
      );
      setMovieData(response.data);

      const videosRef = await api.get(
        `https://api.themoviedb.org/3/movie/${movie_id}/videos`,
        {
          params: {
            api_key: "6876ef12b2f4338d57e35ac8d4f4faf8",
          },
        }
      );
      videosRef.data.results.map((item) => {
        if (item.name == "Official Trailer") {
          setTrailerKey(item.key);
        }
      });

      const actorsRef = await api.get(
        `https://api.themoviedb.org/3/movie/${movie_id}/credits`,
        {
          params: {
            api_key: "6876ef12b2f4338d57e35ac8d4f4faf8",
          },
        }
      );
      // console.log(actorsRef.data.cast);
      setActors(actorsRef.data.cast);
    }
    loadData();
  }, []);
  return (
    <ScrollView>
      <Text>id: {movieData.id}</Text>
      <Text>title: {movieData.title}</Text>
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500/${movieData.backdrop_path}`,
        }}
        style={{ width: 100, height: 100 }}
      />

      <Text>Genre:</Text>
      <FlatList
        keyExtractor={(item) => item.id}
        data={movieData.genres}
        renderItem={({ item }) => (
          <Text style={{ margin: 10 }}>{item.name}</Text>
        )}
        horizontal
      />
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500/${movieData.poster_path}`,
        }}
        style={{ width: 100, height: 100 }}
      />

      <Text>production_companies:</Text>
      <FlatList
        keyExtractor={(item) => item.id}
        data={movieData.production_companies}
        renderItem={({ item }) => (
          <Text style={{ margin: 10 }}>{item.name}</Text>
        )}
        horizontal
      />
      <Text>release: {movieData.release_date}</Text>
      <Text>tagline: {movieData.tagline}</Text>
      <Text>budget: {movieData.budget}</Text>
      <Text>homepage: {movieData.homepage}</Text>
      <Text>overview: {movieData.overview}</Text>

      <YouTubeIframe
        videoId={trailerKey}
        height={270}
        width="100%"
        play={false}
      />

      <Text>Cast:</Text>
      <FlatList
        keyExtractor={(item) => item.id}
        data={actors}
        renderItem={({ item }) =>
          item.profile_path && (
            <View style={{ margin: 10 }}>
              <Text>{item.name}</Text>
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500/${item.profile_path}`,
                }}
                style={{ width: 100, height: 100 }}
              />
              <Text>{item.character}</Text>
            </View>
          )
        }
        horizontal
      />
    </ScrollView>
  );
};

export default Movie;

const styles = StyleSheet.create({});
