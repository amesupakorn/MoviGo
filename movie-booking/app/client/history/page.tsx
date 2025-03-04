"use client";

import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Booking } from "@/lib/types/booking";
import api from "@/lib/axios";

const BookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [moviePosters, setMoviePosters] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get(`/booking/`);
        if (response.data && Array.isArray(response.data.booking)) {
          setBookings(response.data.booking);
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
      }
    };
    fetchBookings();
  }, []);

  const totalPages = Math.max(Math.ceil(bookings.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = bookings.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const fetchPosters = async () => {
      if (!bookings.length) return;

      const posters: { [key: string]: string } = {};
      const movieIds = new Set<string>();

      bookings.forEach((booking) => {
        if (booking.showtime?.movie?.id) {
          movieIds.add(String(booking.showtime.movie.id));
        }
      });

      await Promise.all(
        Array.from(movieIds).map(async (movieId) => {
          try {
            const movieResponse = await api.get(`/movies/${movieId}`);
            posters[movieId] = movieResponse.data.poster_path;
          } catch (error) {
            console.error("Error fetching movie poster:", error);
          }
        })
      );

      setMoviePosters(posters);
    };

    fetchPosters();
  }, [bookings]);

  return (
    <div className="max-w-4xl mx-auto p-6 max-sm:mt-[40px] sm:mt-[40px] md:mt-[80px] lg:mt-24">
      <h2 className="text-lg md:text-xl text-white font-bold mb-4">BOOKING HISTORY</h2>
      <div className="space-y-4">
        {currentBookings.map((booking, index) => {
          const movieId = booking.showtime?.movie?.id;
          const posterPath = movieId ? moviePosters[movieId] : "/default-poster.jpg";
          const formattedTime = booking.showtime?.time
            ? booking.showtime.time.split(":").slice(0, 2).join(":")
            : "N/A";
          return (
            <div key={index} className="flex bg-zinc-800 p-6 shadow-md border border-gray-300 space-x-4 border rounded-lg shadow">

              <img
                src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                alt={booking.showtime?.movie?.title || "Unknown Movie"}
                className="w-auto h-32 md:h-36 object-cover rounded-lg"
              />

              <div className="flex flex-col justify-between w-full">
                <div>
                  <h3 className="text-sm md:text-lg text-white font-semibold">{booking.showtime?.movie?.title || "Unknown Movie"}</h3>
                  <div className="flex items-center text-xs md:text-sm text-gray-600 mt-2">
                    <MapPin className="w-4 h-4 mr-1 text-amber-500" />
                    <span className="text-amber-500 font-medium">{booking.showtime?.subCinema?.location?.name || "Unknown Location"}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-amber-400 mt-2 flex space-x-6 md:space-x-14">
                    <span><span className="font-medium"></span> {booking.showtime?.subCinema?.name || "N/A"}</span>
                    <span><span className="font-medium">Seat no.:</span> {booking.seat?.row}{booking.seat?.number || "N/A"}</span>
                  </p>

                  <p className="text-xs sm:text-sm text-amber-400 mt-1 sm:mt-2 flex space-x-4 md:space-x-10">
                    <span><span className="font-medium">Date:</span> {booking.showtime?.date ? new Date(booking.showtime.date).toLocaleDateString() : "N/A"}</span>
                    <span><span className="font-medium">Time:</span> {formattedTime}</span>
                  </p>

                  <p className="text-xs sm:text-sm text-amber-400 mt-1 sm:mt-2 flex space-x-6">
                    <span><span className="font-medium">Price:</span> {booking.seat?.price ? `${booking.seat.price} THB` : "N/A"}</span>
                  </p>

                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="text-white border px-4 py-2 rounded cursor-pointer disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-white border px-4 py-2 rounded">{currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="text-white border px-4 py-2 rounded cursor-pointer disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookingHistory;
