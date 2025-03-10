"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { MovieBannerProps, MovieDetail } from "@/lib/types/movie";
import { format } from "date-fns";

const MovieBanner: React.FC<MovieBannerProps> = ({ movies }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [moviesDetail, setMoviesDetail] = useState<{ [key: number]: MovieDetail | null }>({});

    useEffect(() => {
        if (movies.length === 0) return;

        const loadMovieDetails = async () => {
            try {
                const details = await Promise.all(
                    movies.map(async (movie) => {
                        const res = await api.get<MovieDetail>(`/movies/${movie.id}`);
                        return { id: movie.id, data: res.data };
                    })
                );
                // เก็บข้อมูล movieDetail
                setMoviesDetail(
                    details.reduce((acc, detail) => {
                        acc[detail.id] = detail.data;
                        return acc;
                    }, {} as { [key: number]: MovieDetail | null })
                );
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };

        loadMovieDetails();
    }, [movies]);

    useEffect(() => {
        if (movies.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [movies]);

    return (
        <div className="relative w-full h-[250px] max-sm:h-[25s0px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
            <div className="carousel w-full h-full relative">
                {movies.map((movie, index) => (
                    <div
                        key={movie.id}
                        className={`absolute w-full h-full bg-cover bg-top transition-opacity duration-1000 ease-in-out transform ${
                            index === currentIndex ? "opacity-100" : "opacity-0"
                        }`}
                        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
                    >

                        {/*  Overlay Content */}
                        <div className="absolute bottom-4 left-4 p-4 rounded-lg text-white text-left mb-5">
                            <h1 className="text-xl sm:text-xl md:text-3xl lg:text-3xl font-bold max-w-2xl">{movie.title}</h1>
                            <div className="flex items-center space-x-4 text-sm text-gray-200">

                                {moviesDetail[movie.id]?.runtime && (
                                    <span>{moviesDetail[movie.id]?.runtime} Mins</span>
                                )}
                                <span className="text-gray-400">|</span>

                                {moviesDetail[movie.id]?.genres && (
                                    <span className="hidden sm:block">{moviesDetail[movie.id]?.genres.map(g => g.name).join("/")}</span>
                                )}
                                <span className="text-gray-400 hidden sm:inline">|</span>

                                {movie.release_date && (
                                    <span>{format(new Date(movie.release_date), "d MMMM yyyy")}</span>
                                )}
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieBanner;
