"use client";

import React, { useState, useEffect, useTransition } from "react";
import api from "@/lib/axios";
import { Movie, MovieResponse, MovieDetail } from "@/lib/types/movie";
import MovieBanner from "@/app/components/MovieBanner";
import Link from "next/link";
import { IoMdPlayCircle } from "react-icons/io";
import { format } from "date-fns";
import LoadTwo from "@/app/components/ui/loading/loadTwo";

const Homepage = () => {
    const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
    const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
    const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
    const [moviesDetail, setMoviesDetail] = useState<{ [key: number]: MovieDetail | null }>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [, startTransition] = useTransition();
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    const categories = {
        "Popular": "/movies/popular",
        "Now playing": "/movies/nowplaying",
        "Upcoming": "/movies/upcoming",
    } as const;

    const [activeTab, setActiveTab] = useState<keyof typeof categories>("Popular");

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const [popularRes, nowPlayingRes, upcomingRes] = await Promise.all([
                    api.get<MovieResponse>(categories["Popular"]),
                    api.get<MovieResponse>(categories["Now playing"]),
                    api.get<MovieResponse>(categories["Upcoming"])
                ]);

                setPopularMovies(popularRes.data.results || []);
                setNowPlayingMovies(nowPlayingRes.data.results || []);
                setUpcomingMovies(upcomingRes.data.results || []);
            } catch (error) {
                console.error("Error fetching movies:", error);
                setError("Failed to load movies");
            } finally {
                setLoading(false);
            }
        };
        loadMovies();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    //โหลดข้อมูล movieDetail ทีละเรื่องเมื่อ hover
    const fetchMovieDetail = async (id: number) => {
        if (moviesDetail[id]) return;
        try {
            const res = await api.get<MovieDetail>(`/movies/${id}`);
            setMoviesDetail(prev => ({ ...prev, [id]: res.data }));
        } catch (error) {
            console.error(`Error fetching movie details for id: ${id}`, error);
        }
    };

    //เลือกข้อมูลตามหมวดหมู่
    const moviesToShow = activeTab === "Popular" 
        ? popularMovies 
        : activeTab === "Now playing" 
        ? nowPlayingMovies 
        : upcomingMovies;

    if (loading) return <LoadTwo />;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-sm:mt-[40px] md:mt-[80px] lg:mt-20">
            <MovieBanner movies={popularMovies} />  

            <div className="container mx-auto py-6">
                {/* Menu */}
                <div className="flex justify-center border-b pb-2">
                    <div className="flex space-x-6 text-lg">
                        {Object.keys(categories).map((category) => (
                            <button 
                                key={category} 
                                className={`cursor-pointer font-semibold relative text-sm flex items-center justify-center px-6 py-2 rounded-md transition-all duration-300 ${
                                    activeTab === category
                                        ? "text-blue-500 font-semibold after:absolute after:w-full after:h-1 after:bg-blue-500 after:bottom-0 after:left-0 after:rounded-full"
                                        : "hover:text-blue-500"
                                }`}
                                onClick={() => startTransition(() => setActiveTab(category as keyof typeof categories))}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Movies Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6 px-4">
                    {moviesToShow.length > 0 ? (
                        moviesToShow.map((movie) => (
                            
                            <Link
                                key={movie.id}
                                href={`/client/movie/${movie.id}`}
                                className="relative group bg-white rounded-lg shadow-md overflow-hidden mx-auto w-full md:max-w-[250px] md:h-[450px] hover:scale-105 transition-transform hover:shadow-xl flex flex-col"
                                onMouseEnter={() => fetchMovieDetail(movie.id)} //โหลด Movie Detail เมื่อ Hover
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-full h-100 object-cover"
                                />
                                <div className="p-4 flex flex-col justify-end flex-grow">
                                <h3 className="text-lg font-bold">
                                    {isSmallScreen && movie?.title?.length > 9
                                        ? `${movie.title.substring(0, 9)}...`
                                        : movie?.title}

                                </h3>
                                    <p className="text-sm text-gray-600">
                                        {movie.release_date ? format(new Date(movie.release_date), "dd MMM yyyy") : "No date available"}
                                    </p>
                                </div>

                                {/* Movie Detail (Hover) */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center text-white p-4">
                                    <IoMdPlayCircle className="w-8 h-8"/>
                                    <h3 className="text-lg font-bold mt-2">

                                    </h3>
                                    {moviesDetail[movie.id] ? (
                                        <>
                                            <p className="text-gray-300 text-sm">Runtime: {moviesDetail[movie.id]?.runtime} mins</p>
                                            <p className="text-gray-300 text-sm">
                                                Genres: {moviesDetail[movie.id]?.genres.map(g => g.name).join("/")}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-gray-400">Loading...</p>
                                    )}
                                    <button className="mt-20 px-4 py-2 bg-white text-black rounded-lg">ดูเพิ่มเติม</button>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-center text-gray-600">No movies found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Homepage;
