import { apiTmdb } from "@/lib/tmdb";
import { MovieDetail } from "@/lib/types/movie";
import { Review, MovieImage, MovieVideo, MovieCredit } from "@/lib/types/movie";


//  Fetch Movie Detail by ID
export const fetchMovieDetail = async (movieId: number): Promise<MovieDetail> => {
    const response = await apiTmdb.get<MovieDetail>(`/movie/${movieId}`, {
        params: { language: "en-US" },
    });
    return response.data;
};

//  Fetch Movie Reviews
export const fetchMovieReviews = async (movieId: number): Promise<Review[]> => {
    const response = await apiTmdb.get<{ results: Review[] }>(`/movie/${movieId}/reviews`);
    return response.data.results;
};

//  Fetch Movie Images
export const fetchMovieImages = async (movieId: number): Promise<MovieImage[]> => {
    const response = await apiTmdb.get<{ backdrops: MovieImage[] }>(`/movie/${movieId}/images`);
    return response.data.backdrops;
};

//  Fetch Movie Videos (Trailers)
export const fetchMovieVideos = async (movieId: number): Promise<MovieVideo[]> => {
    const response = await apiTmdb.get<{ results: MovieVideo[] }>(`/movie/${movieId}/videos`);
    return response.data.results;
};

//  Fetch Movie Credit
export const fetchCreditMovies = async (movieId: number): Promise<MovieCredit[]> => {
    const response = await apiTmdb.get<{ cast: MovieCredit[] }>(`/movie/${movieId}/credits`);
    return response.data.cast;
};