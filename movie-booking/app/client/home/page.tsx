"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Movie } from "@/lib/types/movie";

export default function Home() {
    const [movies, setMovies] = useState<Movie[]>([]); 

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const res = await api.get("/movies/popular"); 
                setMovies(res.data);
            } catch (error) {
                console.error("Error fetching popular movies:", error);
            } 
        };

        loadMovies();
    }, []);

    return (
        <div>
        <h1>Popular Movies</h1>
            <ul>
                {movies.map((movie) => (
                    <li key={movie.id}>{movie.title}</li>
                ))}
            </ul>
        </div>
    )
}