// https://api.themoviedb.org/3/movie/now_playing?api_key=6876ef12b2f4338d57e35ac8d4f4faf8&language=pt-br

import axios from "axios";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
});

export default api;
