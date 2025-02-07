"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import { Movie, MovieResponse } from "@/lib/types/movie";

const MovieDetail = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const res = await api.get<MovieResponse>("/movies/popular");
                setMovies(res.data.results || []);
            } catch (error) {
                console.error("Error fetching popular movies:", error);
                setError("Failed to load movies");
            } finally {
                setLoading(false);
            }
        };
        loadMovies();
    }, []);

    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="">
            <div className="container mx-auto py-6">
                <h1 className="text-4xl font-bold text-center">Popular Movies</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6 px-10">
                    {movies.length > 0 ? (
                        movies.map((movie) => (
                            <a
                                key={movie.id}
                                href="movie-detail.html"
                                className="relative group bg-white rounded-lg shadow-md overflow-hidden mx-auto w-full max-w-[250px] h-[450px] hover:scale-105 transition-transform hover:shadow-xl flex flex-col"
                            >
                                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full h-100 object-cover" />
                                <div className="p-4 flex flex-col justify-end flex-grow">
                                    <h3 className="text-lg font-bold">{movie.title}</h3>
                                    <p className="text-sm text-gray-600">{movie.release_date}</p>
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center text-white p-4">
                                    <h3 className="text-lg font-bold">{movie.title}</h3>
                                    <p className="text-sm">{movie.overview}</p>
                                    <button className="mt-4 px-4 py-2 bg-white text-black rounded-lg">ดูเพิ่มเติม</button>
                                </div>
                            </a>
                        ))
                    ) : (
                        <p className="text-center text-gray-600">No movies found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;
