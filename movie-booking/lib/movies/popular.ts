import { apiTmdb } from "@/lib/tmdb";
import { MovieResponse } from "@/lib/types/movie";



export const fetchPopularMovies = async (page: number = 1): Promise<MovieResponse> => {
    const response = await apiTmdb.get<MovieResponse>("/movie/popular", {
        params: { language: "en-US", page },
    });
    return response.data;
};
