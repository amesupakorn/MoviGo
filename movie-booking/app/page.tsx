"use client";
import { useEffect, useState } from "react";
import { Movie } from "../lib/tmdb";
import { useAlert } from "@/app/context/AlertContext";

export default function Home() {
  // const [movies, setMovies] = useState<Movie[]>([]); 
  const { success, setSuccess } = useAlert(); 


  useEffect(() => {
    if (success) {
      setTimeout(() => setSuccess(null), 3000);
    }

    // const getMovies = async () => {
    //   try {
    //     const response = await fetch("/api/movies"); 
    //     const data = await response.json();
    //     setMovies(data.results || []); 
    //   } catch (error) {
    //     console.error("Error fetching movies:", error);
    //   }
    // };
    // getMovies();
  }, );

  

  return (
    <div className="container mx-auto p-4">
     
    </div>
  );
}
