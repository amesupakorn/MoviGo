import { apiTmdb } from "@/lib/tmdb";
import { MovieSearchResponse } from "../types/movieSearch";

export const fetchSearchMovies = async (query: string, page: number = 1): Promise<MovieSearchResponse> => {
  const response = await apiTmdb.get<MovieSearchResponse>("/search/movie", {
    params: { query, page, language: "en-US" },
  });

  return response.data;
};
