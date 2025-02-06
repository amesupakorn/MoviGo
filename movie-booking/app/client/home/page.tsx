"use client";
import { useState, useEffect } from "react";
import { Movie, MovieResponse } from "@/lib/types/movie";
import api from "@/lib/axios";

export default function Home() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const res = await api.get<MovieResponse>("/movies/popular");

                if (res.data.results) {
                    setMovies(res.data.results);
                } else {
                    setMovies([]);
                }
            } catch (error) {
                console.error("Error fetching popular movies:", error);
                setError("Failed to load movies");
            } finally {
                setLoading(false);
            }
        };

        loadMovies();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h1>Popular Movies</h1>
            {movies.length > 0 ? (
                <ul>
                    {movies.map((movie) => (
                        <li key={movie.id}>
                            <h2>{movie.title}</h2>
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                            <p>{movie.overview}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No movies found.</p>
            )}
        </div>
    );
}