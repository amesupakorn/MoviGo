"use client";
import { useEffect, useState } from "react";
import { Movie } from "../lib/tmdb";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]); 

  useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await fetch("/api/movies"); 
        const data = await response.json();
        setMovies(data.results || []); 
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    getMovies();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Popular Movies</h1>
      <div className="grid grid-cols-4 gap-4">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="p-2 border rounded-md">
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <h2 className="text-lg font-semibold">{movie.title}</h2>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
