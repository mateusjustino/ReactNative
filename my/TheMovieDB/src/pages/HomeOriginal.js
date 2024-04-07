import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const [moviesAction, setMoviesAction] = useState([]);
  const [moviesAdventure, setMoviesAdventure] = useState([]);
  const [moviesComedy, setMoviesComedy] = useState([]);
  const [moviesMistery, setMoviesMistery] = useState([]);
  const [moviesScienceFiction, setMoviesScienceFiction] = useState([]);
  const [moviesHorror, setMoviesHorror] = useState([]);
  const [moviesDocumentary, setMoviesDocumentary] = useState([]);
  const [moviesDrama, setMoviesDrama] = useState([]);

  let allMovies = [];
  useEffect(() => {
    async function loadFilmes() {
      console.log("-".repeat(10));

      await findMoviesNoRepeat(setNowPlaying, null, "now_playing");
      await findMoviesNoRepeat(setPopular, null, "popular");
      await findMoviesNoRepeat(setTopRated, null, "top_rated");
      let dataAtual = new Date();
      let ano = dataAtual.getFullYear();
      let mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
      let dia = String(dataAtual.getDate()).padStart(2, "0");
      let dataFormatada = `${ano}-${mes}-${dia}`;
      await findMoviesNoRepeat(setUpcoming, dataFormatada, "upcoming");

      await findMoviesByGenre(28, setMoviesAction);
      await findMoviesByGenre(12, setMoviesAdventure);
      await findMoviesByGenre(35, setMoviesComedy);
      await findMoviesByGenre(9648, setMoviesMistery);
      await findMoviesByGenre(878, setMoviesScienceFiction);
      await findMoviesByGenre(27, setMoviesHorror);
      await findMoviesByGenre(99, setMoviesDocumentary);
      await findMoviesByGenre(18, setMoviesDrama);

      setLoading(false);
    }
    loadFilmes();
  }, []);

  const findMoviesNoRepeat = async (set, dataFormat, type) => {
    let pages = 1;
    let moviesList = [];
    while (moviesList.length <= 5) {
      const response = await api.get(`movie/${type}`, {
        params: {
          api_key: "6876ef12b2f4338d57e35ac8d4f4faf8",
          page: pages,
          // language: "pt-br",
        },
      });
      const resultsList = response.data.results;
      resultsList.forEach((movie) => {
        let alreadyUse = false;
        allMovies.forEach((movieSaved) => {
          if (movieSaved.id == movie.id) {
            alreadyUse = true;
          }
        });
        if (!alreadyUse) {
          if (dataFormat) {
            if (movie.release_date > dataFormat) {
              moviesList.push(movie);
              allMovies.push(movie);
            }
          } else {
            moviesList.push(movie);
            allMovies.push(movie);
          }
        }
      });
      pages += 1;
    }
    const picotado = moviesList.slice(0, 5);
    set(picotado);
    console.log(`${type}: ${picotado.length}`);
  };

  const findMoviesByGenre = async (idGenre, set) => {
    const response = await api.get(
      "https://api.themoviedb.org/3/discover/movie",
      {
        params: {
          api_key: "6876ef12b2f4338d57e35ac8d4f4faf8",
          with_genres: idGenre,
        },
      }
    );
    // const data = response.data.results.slice(0, 3);
    const data = response.data.results;
    const randomComparator = () => Math.random() - 0.5;
    const dataNewOrder = data.sort(randomComparator);
    const dataSlice = dataNewOrder.slice(0, 5);

    set(dataSlice);
    console.log(`${idGenre}: ${dataSlice.length}`);
  };

  const ListComponent = ({ listTitle, data }) => {
    return (
      <ScrollView horizontal style={{ borderWidth: 1 }}>
        <Text>{listTitle}</Text>
        {data.map((item) => {
          return (
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
          );
        })}
        {/* <FlatList
          keyExtractor={(item) => item.id}
          data={data}
          renderItem={({ item }) => (
            <View
              style={{
                marginVertical: 10,
                marginHorizontal: 10,
                alignItems: "center",
                justifyContent: "center",
                width: 120,
              }}
            >
              <Text>{item.title}</Text>
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/original/${item.poster_path}`,
                }}
                style={{ height: 100, width: 100 }}
              />
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        /> */}
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={20} color="black" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Search")}>
        <Text>Search</Text>
      </TouchableOpacity>
      <ListComponent listTitle="Now playing" data={nowPlaying} />
      <ListComponent listTitle="Popular" data={popular} />
      <ListComponent listTitle="Top Rated" data={topRated} />
      <ListComponent listTitle="Upcoming" data={upcoming} />

      <ListComponent listTitle="Action" data={moviesAction} />
      <ListComponent listTitle="Adventure" data={moviesAdventure} />
      <ListComponent listTitle="Comedy" data={moviesComedy} />
      <ListComponent listTitle="Documentary" data={moviesDocumentary} />
      <ListComponent listTitle="Drama" data={moviesDrama} />
      <ListComponent listTitle="Horror" data={moviesHorror} />
      <ListComponent listTitle="Mistery" data={moviesMistery} />
      <ListComponent listTitle="Science Fiction" data={moviesScienceFiction} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
});
