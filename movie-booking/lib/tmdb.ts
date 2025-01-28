import axios from "axios";

export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    release_date: string;
}

interface MovieResponse {
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export const fetchPopularMovies = async (): Promise<MovieResponse> => {
const response = await axios.get<MovieResponse>("https://api.themoviedb.org/3/movie/popular", {
  params: { language: "en-US", page: 1 },
  headers: {
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
  },
});

return response.data;
};
