import { apiTmdb } from "@/lib/tmdb";
import { MovieResponse } from "@/lib/types/movie";


// Fetch Now Playing Movies
export const fetchNowPlayingMovies = async (page: number = 1): Promise<MovieResponse> => {
    const response = await apiTmdb.get<MovieResponse>("/movie/now_playing", {
        params: { language: "en-US", page },
    });
    return response.data;
};