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
        <div className="p-6">
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

            {/* Videos */}
            <div className="mt-4">
                <h2 className="text-xl font-bold">Trailers</h2>
                {videos.map(video => (
                    video.site === "YouTube" && (
                        <iframe key={video.id} src={`https://www.youtube.com/embed/${video.key}`} width="560" height="315" allowFullScreen />
                    )
                ))}
            </div>
        </div>
    );
}