"use client";

import React, { useState } from "react";
import { MapPin } from "lucide-react";

const bookings = [
  {
    title: "TAYLOR SWIFT | THE ERAS TOUR",
    image: "/taylor-swift-eras-tour.jpg",
    location: "SF WORLD CINEMA Central World",
    date: "19 October 2023",
    time: "17:30",
    cinema: "1",
    seats: "B5, B6",
    price: "1,000 THB",
  },
  {
    title: "Buppe 2",
    image: "/buppe-2.jpg",
    location: "SF CINEMA The Mall Bangkae",
    date: "30 July 2022",
    time: "11:00",
    cinema: "2",
    seats: "A3, A4",
    price: "800 THB",
  },
  {
    title: "Movie 3",
    image: "/movie-3.jpg",
    location: "SF CINEMA Central",
    date: "15 August 2023",
    time: "14:00",
    cinema: "3",
    seats: "C1, C2",
    price: "900 THB",
  },
  {
    title: "Movie 4",
    image: "/movie-4.jpg",
    location: "SF CINEMA Downtown",
    date: "20 September 2023",
    time: "18:00",
    cinema: "4",
    seats: "D5, D6",
    price: "1,200 THB",
  },
  {
    title: "Movie 5",
    image: "/movie-5.jpg",
    location: "SF CINEMA Uptown",
    date: "25 October 2023",
    time: "20:30",
    cinema: "5",
    seats: "E3, E4",
    price: "1,500 THB",
  },
  {
    title: "Buppe 2",
    image: "/buppe-2.jpg",
    location: "SF CINEMA The Mall Bangkae",
    date: "30 July 2022",
    time: "11:00",
    cinema: "2",
    seats: "A3, A4",
    price: "800 THB",
  },
  {
    title: "Movie 3",
    image: "/movie-3.jpg",
    location: "SF CINEMA Central",
    date: "15 August 2023",
    time: "14:00",
    cinema: "3",
    seats: "C1, C2",
    price: "900 THB",
  },
  {
    title: "Movie 4",
    image: "/movie-4.jpg",
    location: "SF CINEMA Downtown",
    date: "20 September 2023",
    time: "18:00",
    cinema: "4",
    seats: "D5, D6",
    price: "1,200 THB",
  },
];

const BookingHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = bookings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-4xl mx-auto p-6 max-sm:mt-[40px] md:mt-[80px] lg:mt-24">
      <h2 className="text-xl font-bold mb-4">BOOKING HISTORY</h2>
      <div className="space-y-4">
        {currentBookings.map((booking, index) => (
          <div key={index} className="flex p-4 space-x-4 border rounded-lg shadow">
            <img
              src={booking.image}
              alt={booking.title}
              className="w-24 h-32 object-cover rounded-lg"
            />
            <div className="flex flex-col justify-between w-full">
              <div>
                <h3 className="text-lg font-semibold">{booking.title}</h3>
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-blue-500 font-medium">{booking.location}</span>
                </div>
                <p className="text-sm text-gray-700 mt-3 flex space-x-6">
                  <span><span className="font-medium">Cinema:</span> {booking.cinema}</span>
                  <span><span className="font-medium">Seat no.:</span> {booking.seats}</span>
                </p>
                <p className="text-sm text-gray-700 mt-2 flex space-x-6">
                  <span><span className="font-medium">Date:</span> {booking.date}</span>
                  <span><span className="font-medium">Time:</span> {booking.time}</span>
                  <span><span className="font-medium">Price:</span> {booking.price}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`border px-4 py-2 rounded ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          Prev
        </button>
        <span className="border px-4 py-2 rounded">{currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`border px-4 py-2 rounded ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookingHistory;
