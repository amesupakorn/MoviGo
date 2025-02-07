import { apiTmdb } from "@/lib/tmdb";
import { MovieResponse } from "@/lib/types/movie";


// ✅ Fetch Upcoming Movies
export const fetchUpcomingMovies = async (page: number = 1): Promise<MovieResponse> => {
    const response = await apiTmdb.get<MovieResponse>("/movie/upcoming", {
        params: { language: "en-US", page },
    });
    return response.data;
};