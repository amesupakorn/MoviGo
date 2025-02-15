"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MovieDetail, MovieVideo, MovieCredit, MovieImage } from "@/lib/types/movie";
import { IoIosTimer } from "react-icons/io";
import { format } from "date-fns";

export default function MovieDetailPage() {
    const { id } = useParams();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [videos, setVideos] = useState<MovieVideo[]>([]);
    const [credits, setCredits] = useState<MovieCredit[]>([]);
    const [images, setImages] = useState<MovieImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const [movieRes, videoRes, creditsRes, imageRes] = await Promise.all([
                    fetch(`/api/movies/${id}`).then(res => res.json()),
                    fetch(`/api/movies/${id}/video`).then(res => res.json()),
                    fetch(`/api/movies/${id}/credits`).then(res => res.json()),
                    fetch(`/api/movies/${id}/images`).then(res => res.json()),
                ]);

                setMovie(movieRes);
                setVideos(videoRes || []);
                setCredits(creditsRes || []);
                setImages(imageRes);
            } catch (err) {
                console.error("Error fetching movie details:", err);
                setError("Failed to fetch movie details.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!movie) return <p>Movie not found</p>;

    return (
        <div>
            {/* Hero Section */}
            <div
            className="w-full h-[350px] max-sm:h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] bg-cover bg-top relative inset-0 flex flex-col justify-center max-sm:mt-[40px] md:mt-[80px] lg:mt-20"
            style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            }}
        ></div>


            {/* Movie Info Section */}
            <div className="container mx-auto md:p-6 bg-white shadow-lg rounded-lg mt-6">
                <div className="container mx-auto md:py-8 px-4">
                    
                    <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-6">
                        {/* Movie Poster */}
                        <div className="w-full md:block hidden lg:w-1/5 mx-auto lg:mx-0">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt="Movie Poster"
                                className="rounded-lg shadow-lg w-[150px] sm:w-[180px] md:w-[210px]"
                            />
                        </div>

                        {/* Movie Details */}
                        <div className="w-full sm:w-2/3 md:w-2/4 lg:w-1/5 sm:text-left">
                            <h1 className="text-3xl sm:text-3xl md:text-2xl font-bold">{movie.title}</h1>
                            <p className="text-gray-600">
                                Release: {movie.release_date ? format(new Date(movie.release_date), "dd MMMM yyyy") : "No date available"}
                            </p>
                            <p className="mt-2 text-gray-600">
                                Genres: {movie.genres.map((genre) => genre.name).join(", ")}
                            </p>
                            <span className="mt-2 text-gray-600 flex items-center">
                                <IoIosTimer className="mr-1" />
                                {movie.runtime} mins
                            </span>

                        </div>

                        {/* Video Section */}
                        <div className="w-full sm:w-4/5 md:w-3/5 lg:w-3/5 ">
                            {videos.length > 0 && (
                                <iframe
                                    src={`https://www.youtube.com/embed/${videos[0].key}`}
                                    width="100%"
                                    height="200"
                                    allowFullScreen
                                    className="rounded-lg shadow-lg sm:w-[400px] sm:h-[225px] md:w-[500px] md:h-[281px] lg:w-[560px] lg:h-[315px] ml-auto"
                                />
                            )}
                        </div>
                    </div>

                    {/* Cast Section */}
                    <h3 className="text-xl font-bold mt-20">Cast</h3>
                    <div className="overflow-x-auto mt-4">
                        <div className="flex gap-10">
                            {credits.slice(0, 10).map((actor, index) => (
                                <div key={index} className="text-center flex-shrink-0">
                                    <img
                                        src={
                                            actor.profile_path
                                                ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                                : "/uploads/default_profile.jpg"
                                        }
                                        alt={actor.name}
                                        className="w-auto max-sm:w-28 max-sm:h-36 md:w-32 h-48 object-cover rounded-lg mx-auto"
                                    />
                                    <p className="mt-2 text-gray-700 break-words w-[150px]">{actor.name}</p>
                                    <p className="text-sm text-gray-500 break-words w-[120px]">{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <hr className="mt-10" />

                    {/* Image */}
                    <h3 className="text-xl font-bold mt-10">Image</h3>
                    <div className="overflow-x-auto mt-4">
                        <div className="flex gap-10">
                        {images.map((img, index) => (
                            <div key={index} className="text-center flex-shrink-0">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                                    alt={`Image for ${movie.title}`}
                                    className="w-auto max-sm:w-48 sm:h-auto md:w-56 object-cover rounded-lg mx-auto"
                                />
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Synopsis Section */}
            <div className="container mx-auto p-6 mt-6">
                <h3 className="text-xl font-bold">SYNOPSIS</h3>
                <p className="text-gray-700 mt-2">{movie.overview}</p>
            </div>
        </div>
    );
}
