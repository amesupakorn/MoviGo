"use client";

import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Order } from "@/lib/types/booking";
import api from "@/lib/axios";

const BookingHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [moviePosters, setMoviePosters] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // 🟢 ดึงข้อมูลการจองจาก Backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get(`/booking/`);
        if (Array.isArray(response.data.orders)) {
          setOrders(response.data.orders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setOrders([]);
      }
    };
    fetchBookings();
  }, []);

  const totalPages = Math.max(Math.ceil(orders.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = orders.slice(startIndex, startIndex + itemsPerPage);

  // 🟢 ดึงรูปภาพหนังจาก API
  useEffect(() => {
    const fetchPosters = async () => {
      if (!orders.length) return;

      const posters: { [key: string]: string } = {};
      const movieIds = new Set<string>();

      orders.forEach((order) => {
        order.booking.forEach((booking) => {
          if (booking.showtime?.movie?.id) {
            movieIds.add(String(booking.showtime.movie.id));
          }
        });
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
  }, [orders]);

  // 🟢 จัดกลุ่ม bookings ตาม (movieId, subCinemaId, date, time)
  const groupedBookings = currentBookings.reduce((acc, order) => {
    order.booking.forEach((booking) => {
      const key = `${booking.showtime.movie.id}-${booking.showtime.subCinema.id}-${booking.showtime.date}-${booking.showtime.time}`;
      
      if (!acc[key]) {
        acc[key] = {
          ...booking,
          seats: [], 
          totalPrice: 0, 
        };
      }

      acc[key].seats.push(`${booking.seat.row}${booking.seat.number}`);
      acc[key].totalPrice += booking.seat.price; 

    });

    return acc;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as Record<string, any>);

  return (
    <div className="max-w-4xl mx-auto p-6 mt-20 max-sm:mt-[40px]">
      <h2 className="text-lg md:text-xl text-white font-bold mb-4">BOOKING HISTORY</h2>
      <div className="space-y-4">
        {Object.values(groupedBookings).map((booking, index) => {
          const movieId = booking.showtime?.movie?.id;
          const posterPath = movieId
            ? `https://image.tmdb.org/t/p/w500${moviePosters[movieId] || booking.showtime.movie.poster_path}`
            : "/default-poster.jpg";

          const formattedTime = booking.showtime?.time
            ? booking.showtime.time.split(":").slice(0, 2).join(":")
            : "N/A";

          const formattedDate = booking.showtime?.date
            ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(booking.showtime.date))
            : "N/A";

          return (
            <div key={index} className="flex bg-zinc-800 p-6 shadow-md border border-gray-400 space-x-4 rounded-lg">
              {/* รูปโปสเตอร์ของหนัง */}
              <img
                src={posterPath}
                alt={booking.showtime?.movie?.title || "Unknown Movie"}
                className="w-auto h-32 md:h-36 object-cover rounded-lg"
              />
              <div className="flex flex-col justify-between w-full">
                <div>
                  <h3 className="text-sm md:text-lg text-white font-semibold">
                    {booking.showtime?.movie?.title || "Unknown Movie"}
                  </h3>

                  {/* สถานที่ฉายหนัง */}
                  <div className="flex items-center text-xs md:text-sm text-gray-600 mt-2">
                    <MapPin className="w-4 h-4 mr-1 text-gray-100" />
                    <span className="text-gray-200 font-medium">
                       {booking.showtime?.subCinema?.location?.name || "Unknown Location"}
                    </span>
                  </div>

                  {/* ข้อมูลที่นั่ง & โรงภาพยนตร์ */}
                  <div className="md:flex-row  flex-col flex mt-2 md:space-x-5 mb-1 md:space-y-0 space-y-1">
                    <p className="text-xs sm:text-sm text-amber-400">
                      <span className="font-medium text-gray-100">Cinema :</span> {booking.showtime?.subCinema?.name || "N/A"}
                    </p>
                    <p className="text-xs sm:text-sm text-amber-400">
                      <span className="font-medium text-gray-100">Seat no :</span> {booking.seats.join(", ")}
                    </p>
                  </div>
                  
                  <div className="md:w-[250px] w-full h-[1px] bg-amber-400 "></div>

                  <div className="md:flex-row  flex-col flex mt-2 md:space-x-5 mb-1 md:space-y-0 space-y-1">
                    {/* วันที่และเวลา */}
                    <p className="text-xs sm:text-sm text-amber-400">
                      <span className="font-medium text-gray-100">Date :</span> {formattedDate}
                    </p>
                    <p className="text-xs sm:text-sm text-amber-400">
                      <span className="font-medium text-gray-100">Time :</span> {formattedTime}
                    </p>
                  </div>

                  {/* ราคา */}
                  <p className="text-xs sm:text-sm text-amber-400 mt-1 sm:mt-2">
                    <span className="font-medium text-gray-100">Total Price :</span> {`${booking.totalPrice} THB`}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
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