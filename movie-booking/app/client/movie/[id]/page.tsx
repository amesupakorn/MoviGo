"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MovieDetail } from "@/lib/types/movie";

export default function MovieDetailPage() {
    const { id } = useParams();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const loadMovieDetail = async () => {
            try {
                const res = await fetch(`/api/movies/${id}`);
                
                const data = await res.json();
                setMovie(data);
            } catch (error) {
                console.error("Error fetching movie details:", error);
            } finally {
                setLoading(false);
            }
        };

        loadMovieDetail();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!movie) return <p>Movie not found</p>;

    return (
        <div className="p-6">
            {/* ✅ ใช้ `backdrop_path` เป็นภาพใหญ่เต็มจอ */}
            <div className="relative w-full h-96">
                <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                />
               
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <h1 className="text-4xl font-bold text-white">{movie.title}</h1>
                </div>
            </div>

            {/* Movie Details */}
            <div className="mt-6">
                <h2 className="text-2xl font-bold">{movie.title}</h2>
                <p className="text-gray-400 italic">{movie.tagline}</p>
                <p className="text-gray-300">{movie.overview}</p>
                <p className="text-gray-400">Release Date: {movie.release_date}</p>
                <p className="text-gray-400">Runtime: {movie.runtime} mins</p>
                <p className="text-gray-400">Rating: {movie.vote_average.toFixed(1)}</p>
                <p className="text-gray-400 mt-2">
                    Genres: {movie.genres.map(g => g.name).join(", ")}
                </p>
            </div>

            {/* Poster */}
          
        </div>
    );
}