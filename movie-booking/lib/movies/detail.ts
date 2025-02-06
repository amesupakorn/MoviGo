import { apiClient } from "@/lib/tmdb";
import { MovieDetail } from "@/lib/types/movie";
import { Review, MovieImage, MovieVideo } from "@/lib/types/movie";


// ✅ Fetch Movie Detail by ID
export const fetchMovieDetail = async (movieId: number): Promise<MovieDetail> => {
    const response = await apiClient.get<MovieDetail>(`/movie/${movieId}`, {
        params: { language: "en-US" },
    });
    return response.data;
};

// ✅ Fetch Movie Reviews
export const fetchMovieReviews = async (movieId: number): Promise<Review[]> => {
    const response = await apiClient.get<{ results: Review[] }>(`/movie/${movieId}/reviews`);
    return response.data.results;
};

// ✅ Fetch Movie Images
export const fetchMovieImages = async (movieId: number): Promise<MovieImage[]> => {
    const response = await apiClient.get<{ backdrops: MovieImage[] }>(`/movie/${movieId}/images`);
    return response.data.backdrops;
};

// ✅ Fetch Movie Videos (Trailers)
export const fetchMovieVideos = async (movieId: number): Promise<MovieVideo[]> => {
    const response = await apiClient.get<{ results: MovieVideo[] }>(`/movie/${movieId}/videos`);
    return response.data.results;
};

