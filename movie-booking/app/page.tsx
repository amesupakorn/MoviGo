"use client";
import { useEffect, useState } from "react";
import LoadTwo from "@/app/components/ui/loading/loadTwo"

export default function Home() {
  // const [movies, setMovies] = useState<Movie[]>([]); 
  // const { success, setSuccess } = useAlert(); 
  // useEffect(() => {
  //   if (success) {
  //     setTimeout(() => setSuccess(null), 3000);
  //   }

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        setTimeout(() => {
            setLoading(false); // Simulate a delay (replace with actual loading logic)
        }, 3000);
    }, []);
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

    return (
      <div>
          {loading && <LoadTwo />}
          <div className="p-8 text-white"> {/* Page content */}
              <h1 className="text-2xl">Welcome to My Page</h1>
              <p>This is some content...</p>
          </div>
      </div>
  );
};
