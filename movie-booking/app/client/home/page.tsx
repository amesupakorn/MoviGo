"use client";

import React, { useState, useEffect, useTransition } from "react";
import api from "@/lib/axios";
import { Movie, MovieResponse, MovieDetail } from "@/lib/types/movie";
import MovieBanner from "@/app/components/MovieBanner";
import Link from "next/link";
import { IoMdPlayCircle } from "react-icons/io";
import { format } from "date-fns";
import LoadTwo from "@/app/components/ui/loading/loadTwo";
import { IoIosTimer } from "react-icons/io";
import { BiCategory } from "react-icons/bi";
import { TiStarFullOutline } from "react-icons/ti";
import 'aos/dist/aos.css';

const Homepage = () => {
    const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
    const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
    const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
    const [moviesDetail, setMoviesDetail] = useState<{ [key: number]: MovieDetail | null }>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [, startTransition] = useTransition();
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);


    const categories = {
        "Popular": "/movies/popular",
        "Now playing": "/movies/nowplaying",
        "Upcoming": "/movies/upcoming",
    } as const;

    const [activeTab, setActiveTab] = useState(Object.keys(categories)[0]);


    useEffect(() => {
        setActiveMenu(activeTab);
    }, [activeTab]);


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
            setIsSmallScreen(window.innerWidth < 630);
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
                <div className="flex justify-center border-b border-gray-500 pb-2">
                    <ul className="flex space-x-6 text-lg">
                    {Object.keys(categories).map((category) => {
                        const isActive = activeMenu === category;
                        return (
                            <li key={category} className="relative group">
                                <div
                                    className={`cursor-pointer relative md:text-sm text-xs flex items-left md:px-6 px-2 py-2 rounded-md transition-all duration-300 ${
                                        activeTab === category ? "text-amber-500 font-semibold" : "text-white"
                                    } hover:text-amber-500`}
                                    onClick={() => {
                                        setActiveMenu(category); 
                                        startTransition(() => setActiveTab(category as keyof typeof categories)); // Update activeTab state
                                    }}
                                >
                                    {category}
                                </div>

                                <span
                                    className={`absolute left-0 bottom-0 w-full h-[3px] bg-amber-400 transition-all duration-300 rounded-md ${
                                        isActive ? "scale-x-100" : "scale-x-0"
                                    } group-hover:scale-x-100`}
                                />
                            </li>
                        );
                    })}
                    </ul>
                </div>

                {/* Movies Grid */}
                <div   className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-4 py-6 px-2">
                    {moviesToShow.length > 0 ? (
                        moviesToShow.map((movie) => (
                            
                            <Link
                                key={movie.id}
                                href={`/client/movie/${movie.id}`}
                                className="relative group bg-zinc-100 rounded-lg shadow-md overflow-hidden mx-auto w-full md:max-w-[250px] md:h-[450px] hover:scale-105 transition-transform hover:shadow-xl flex flex-col"
                                onMouseEnter={() => fetchMovieDetail(movie.id)} //โหลด Movie Detail เมื่อ Hover
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-full h-100 object-cover"
                                />
                                <div className="p-2 flex flex-col justify-end flex-grow">

                                    <h3 className="text-xs md:text-base font-bold">
                                        {isSmallScreen && movie?.title?.length > 9
                                            ? `${movie.title.substring(0, 9)}...`
                                            : movie?.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 md:block hidden">
                                        {movie.release_date
                                        ? isSmallScreen
                                            ? format(new Date(movie.release_date), "dd/MM/yy") // วันที่ย่อเมื่อ max-sm
                                            : format(new Date(movie.release_date), "dd MMM yyyy") // วันที่เต็ม
                                        : "No date available"}
                                    </p>

                                </div>

                                {/* Movie Detail (Hover) */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center text-white p-2">
                                    <IoMdPlayCircle className="w-8 h-8"/>
                                    <h3 className="text-lg font-bold mt-2">

                                    </h3>
                                    {moviesDetail[movie.id] ? (
                                        <div>
                                            <p className="text-gray-300 md:text-base text-xs flex items-center">
                                                <IoIosTimer className="mr-1" /> 
                                                {moviesDetail[movie.id]?.runtime} mins
                                            </p>
                                            <p className="text-gray-300 md:text-base text-xs w-full flex items-center">
                                                <BiCategory className="mr-2 flex-shrink-0" />
                                                <span className="whitespace-normal break-words flex-1">
                                                    {moviesDetail[movie.id]?.genres.map(g => g.name).join("/")}
                                                </span>
                                            </p>
                                            <p className="text-amber-300 md:text-base text-xs flex items-center">
                                                <TiStarFullOutline className="mr-1"/> 
                                                {moviesDetail[movie.id]?.vote_average}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400">Loading...</p>
                                    )}
                                    <button className="md:mt-20 mt-5 px-4 py-2 bg-white md:text-base text-xs text-black rounded-lg">More</button>
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
