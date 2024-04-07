import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigation } from "@react-navigation/native";
import CarouselComponent from "../components/Carousel";
import { colors } from "../theme/palette";
import { Feather } from "@expo/vector-icons";

export default function Home() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState({
    now_playing: [],
    popular: [],
    top_rated: [],
    upcoming: [],
    action: [],
    adventure: [],
    comedy: [],
    mistery: [],
    scienceFiction: [],
    horror: [],
    documentary: [],
    drama: [],
  });

  useEffect(() => {
    setLoading(true);

    async function fetchData() {
      const now_playing = await loadFilmesWithNoRepeat("now_playing");
      const popular = await loadFilmesWithNoRepeat("popular");
      const top_rated = await loadFilmesWithNoRepeat("top_rated");
      const upcoming = await loadFilmesWithNoRepeat("upcoming");
      const action = await loadFilmes(28);
      setMovies((prevState) => ({
        ...prevState,
        now_playing: now_playing,
        popular: popular,
        top_rated: top_rated,
        upcoming: upcoming,
        action: action,
      }));

      setLoading(false);
    }
    fetchData();
  }, []);

  let moviesSaved = [];

  const loadFilmesWithNoRepeat = async (type) => {
    const response = await api.get(`movie/${type}`, {
      params: {
        api_key: "6876ef12b2f4338d57e35ac8d4f4faf8",
        language: "en-US",
      },
    });
    let resultsList = response.data.results;

    // just to check if the upcoming is after
    if (type === "upcoming") {
      let newResultList = [];
      let pages = 0;

      const dataAtual = new Date();
      const ano = dataAtual.getFullYear();
      const mes = String(dataAtual.getMonth() + 1).padStart(2, "0"); // Os meses começam em 0, então é necessário adicionar 1
      const dia = String(dataAtual.getDate()).padStart(2, "0");
      const dataFormatada = `${ano}-${mes}-${dia}`;

      while (newResultList < 5) {
        pages += 1;
        const response = await api.get(`movie/${type}`, {
          params: {
            api_key: "6876ef12b2f4338d57e35ac8d4f4faf8",
            language: "en-US",
            page: pages,
          },
        });

        let resultsList = response.data.results;
        for (const movie of resultsList) {
          if (movie.release_date > dataFormatada) {
            newResultList.push(movie);
          }
        }
      }
      resultsList = newResultList;
    }

    const newList = [];
    for (const movie of resultsList) {
      if (!moviesSaved.some((savedMovie) => savedMovie.id === movie.id)) {
        moviesSaved.push(movie);
        newList.push(movie);
      }
      if (newList.length >= 5) {
        break;
      }
    }

    return newList;
  };

  const loadFilmes = async (idGenre) => {
    const response = await api.get(
      "https://api.themoviedb.org/3/discover/movie",
      {
        params: {
          api_key: "6876ef12b2f4338d57e35ac8d4f4faf8",
          language: "en-US",
          with_genres: idGenre,
        },
      }
    );
    const data = response.data.results;
    const randomComparator = () => Math.random() - 0.5;
    const dataNewOrder = data.sort(randomComparator);
    const dataSlice = dataNewOrder.slice(0, 5);
    return dataSlice;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={20} color="black" />
      </View>
    );
  }

  // console.log(StatusBar.currentHeight);
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Feather name="search" size={24} color={colors.color1} />
          <Text style={styles.titleApp}>TitleApp</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <Feather name="search" size={24} color={colors.color1} />
          </TouchableOpacity>
        </View>

        <Text style={styles.titleCarousel}>Popular Now</Text>

        <View style={{ alignItems: "center" }}>
          <CarouselComponent data={movies.now_playing} />
        </View>

        <Text>popular</Text>
        <FlatList
          data={movies.popular}
          renderItem={({ item }) => (
            <Text style={{ margin: 5 }}>{item.title}</Text>
          )}
          horizontal
        />

        <Text>top_rated</Text>
        <FlatList
          data={movies.top_rated}
          renderItem={({ item }) => (
            <Text style={{ margin: 5 }}>{item.title}</Text>
          )}
          horizontal
        />

        <Text>upcoming</Text>
        <FlatList
          data={movies.upcoming}
          renderItem={({ item }) => (
            <View>
              <Text style={{ margin: 5 }}>{item.title}</Text>
              <Text style={{ margin: 5 }}>{item.release_date}</Text>
            </View>
          )}
          horizontal
        />

        <Text>action</Text>
        <FlatList
          data={movies.action}
          renderItem={({ item }) => (
            <View>
              <Text style={{ margin: 5 }}>{item.title}</Text>
            </View>
          )}
          horizontal
        />
        <Text>a</Text>
        <Text>a</Text>
        <Text>a</Text>
        <Text>a</Text>
        <Text>a</Text>
        <Text>a</Text>
        <Text>a</Text>
        <Text>a</Text>
        <Text>a</Text>
        <Text>a</Text>
        <Text>a</Text>
        <Text>a</Text>
        <Text>a</Text>
        <Text>a</Text>
        <Text>a</Text>
        <Text>a</Text>
        <Text>a</Text>
        <Text>a</Text>
        <Text>a</Text>
        <Text>a</Text>
        <Text>a</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
    backgroundColor: colors.color6,
  },
  header: {
    marginVertical: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "red",
    justifyContent: "space-around",
  },
  titleApp: {
    fontSize: 20,
    color: colors.color2,
  },
  titleCarousel: {
    textAlign: "center",
    fontSize: 20,
    color: colors.color2,
    marginVertical: 10,
  },
});
