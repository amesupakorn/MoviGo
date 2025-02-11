"use client";
import { useEffect, useState } from "react";
import { MovieDetail, Review, MovieImage, MovieVideo } from "@/lib/types/movie";
import { useParams } from "next/navigation";

export default function MovieDetailPage() {
    const { id } = useParams(); 
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [images, setImages] = useState<MovieImage[]>([]);
    const [videos, setVideos] = useState<MovieVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [moviesDetail, setMoviesDetail] = useState<{ [key: number]: MovieDetail | null }>({});

    useEffect(() => {
        if (!id) return;

        const loadMovieData = async () => {
            try {
                const [movieRes, reviewRes, imageRes, videoRes] = await Promise.all([
                    fetch(`/api/movies/${id}`).then(res => res.json()),
                    fetch(`/api/movies/${id}/review`).then(res => res.json()),
                    fetch(`/api/movies/${id}/images`).then(res => res.json()),
                    fetch(`/api/movies/${id}/video`).then(res => res.json()),
                ]);

                setMovie(movieRes);
                setReviews(reviewRes);
                setImages(imageRes);
                setVideos(videoRes);
            } catch (error) {
                console.error("Error fetching movie details:", error);
            } finally {
                setLoading(false);
            }
        };

        loadMovieData();
    }, [id]);
    

    if (loading) return <p>Loading...</p>;
    if (!movie) return <p>Movie not found</p>;

    return (
        <div >
            <div
                className="w-full h-[350px] md:h-[400px] lg:h-[500px] bg-cover bg-top relative inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center"
                style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                }}
            >
            </div>

            {/* Movie Info Section */}
            <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
                <div className="container mx-auto py-8 px-4">
                <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-6">
                    {/* Movie Poster */}
                    <div className="w-full lg:w-1/4">
                    <img
                        src="movie-poster.jpg"
                        alt="Movie Poster"
                        className="rounded-lg shadow-lg w-full"
                    />
                    </div>

                    {/* Movie Details */}
                    <div className="w-full lg:w-1/4">
                    <h1 className="text-4xl font-bold">{movie.title}</h1>
                    <p className="text-gray-400 text-sm mt-2">12 February 2025</p>
                    <p className="mt-2 text-gray-400">แอ็คชัน, ผจญภัย, วิทยาศาสตร์</p>
                    <p className="mt-2 text-gray-500 flex items-center">118 นาที</p>
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
                    </div>

                    {/* Video Section */}
                    <div className="w-full lg:w-2/4">
                    {(() => {
                    const firstYouTubeVideo = videos.find(video => video.site === "YouTube");
                    const videoKey = firstYouTubeVideo ? firstYouTubeVideo.key : "defaultVideoKey";
                    return (
                        <iframe
                            src={`https://www.youtube.com/embed/${videoKey}`}
                            width="560"
                            height="315"
                            allowFullScreen
                        />
                    );
                })()}
                    </div>
                </div>

                {/* Cast Section */}
                <h3 className="text-xl font-bold mt-6">นักแสดง</h3>
                <div className="overflow-x-auto mt-4">
                    <div className="flex gap-10">
                    {[
                        { name: "Nonaka Kokona", image: "actor1.jpg" },
                        { name: "Nirei Nozomi", image: "actor2.jpg" },
                        { name: "Nina Hanamiya", image: "actor3.jpg" },
                        { name: "Kan Kanna", image: "actor4.jpg" },
                        { name: "Kotoko Sasaki", image: "actor5.jpg" },
                        { name: "Actor 6", image: "actor6.jpg" },
                        { name: "Actor 7", image: "actor7.jpg" },
                    ].map((actor, index) => (
                        <div key={index} className="text-center flex-shrink-0">
                        <img
                            src={actor.image}
                            alt={actor.name}
                            className="w-24 h-24 rounded-full mx-auto"
                        />
                        <p className="mt-2 text-gray-700">{actor.name}</p>
                        </div>
                    ))}
                    </div>
                </div>
                </div>
            </div>

            {/* Synopsis Section */}
            <div className="container mx-auto p-6 mt-6">
                <h3 className="text-xl font-bold">SYNOPSIS</h3>
                <p className="text-gray-700 mt-2">
                หลังจากได้พบกับ แธดเดียส รอสส์ ประธานาธิบดีคนใหม่ของสหรัฐอเมริกา
                แซม ก็พบว่าเขากำลังอยู่ท่ามกลางความขัดแย้งระหว่างประเทศ
                ทำให้เขาต้องค้นหาสาเหตุเบื้องหลังของเหตุการณ์อันเลวร้าย
                ก่อนที่โลกทั้งใบจะลุกเป็นไฟด้วยแผนการของวายร้ายคนนี้
                </p>
            </div>
            
            

            <div className="py-6 px-10">
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <p className="text-gray-400 italic">{movie.tagline}</p>

            {/* Images */}
            <div className="mt-4">
                <h2 className="text-xl font-bold">Images</h2>
                <div className="flex space-x-2 overflow-x-auto">
                    {images.map((img, index) => (
                        <img key={index} src={`https://image.tmdb.org/t/p/w500${img.file_path}`} alt="Movie" className="w-48 rounded-lg" />
                    ))}
                </div>
            </div>

            </div>
        </div>
    );
}