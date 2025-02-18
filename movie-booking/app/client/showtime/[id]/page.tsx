"use client";
import React, { useEffect, useState } from "react";
import SeatStandard from "@/app/components/ui/seat/standard";
import SeatPremium from "@/app/components/ui/seat/premium";
import { useParams } from "next/navigation";
import { Showtime } from "@/lib/types/booking";
import api from "@/lib/axios";
import LoadTwo from "@/app/components/ui/loading/loadTwo";

const CinemaSeatBooking = () => {
  const rows = ["M", "L", "K", "J", "H", "G", "F", "E", "D", "C", "B", "A"]; // Reversed rows
  const seatsPerRow = 12;
  const premiumRows = ["A", "B", "C", "D", "E", "F"]; // Premium rows

  
  const { id } = useParams();
  const [show, setShowtime] = useState<Showtime | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchshowtime = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/showtime/${id}`);
        setShowtime(response.data);
      } catch (err) {
        setError("Failed to fetch location details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchshowtime();
  }, [id]);

  if (loading) return <LoadTwo/> ;
  if (error) return <div className="text-red-500">{error}</div>;


  return (


    <div className="min-h-screen bg-gray-100 p-12">

<div className="bg-gray-100 p-6 min-h-screen">
      {/* Movie Poster */}
      <div className="flex justify-center">
        <img
          className="w-72 h-auto rounded-lg shadow-lg"
          src={`https://image.tmdb.org/t/p/w500${show?.movie.poster_path}`}
          alt={show?.movie.title}
        />
      </div>

      {/* Movie Info */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold text-center">${show?.movie.title}</h1>
        <p className="text-lg text-center text-gray-700 mt-2">
          19 February 2025 | 12:20
        </p>
        <p className="text-base text-center text-gray-500">
          Empir' Cineclub Emporium Sukhumvit
        </p>
      </div>

      {/* Movie Details and Pricing */}
      <div className="mt-8 flex justify-center gap-8">
        <div className="text-center">
          <p className="text-xl font-semibold">CINEMA 4</p>
        </div>
        <div className="text-center flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-300 rounded-full"></div> {/* Replace with seat icon */}
          <p className="text-sm">Standard 320 THB</p>
        </div>
        <div className="text-center flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-700 rounded-full"></div> {/* Replace with seat icon */}
          <p className="text-sm">Premium 350 THB</p>
        </div>
      </div>

      {/* Language and Subtitle */}
      <div className="mt-6 flex justify-center gap-8">
        <div className="text-center">
          <p className="text-sm">Audio: ENG</p>
        </div>
        <div className="text-center">
          <p className="text-sm">Subtitles: TH</p>
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-8 flex justify-center">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg">
          Continue
        </button>
      </div>
    </div>
      {/* Cinema Information */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-6">
          <div className="bg-gray-200 p-6 rounded-md shadow-md">
            <h1 className="text-4xl font-bold">CINEMA 12</h1>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-800">ZIGMA CINESTADIUM</h2>
        </div>
      </div>

      {/* Pricing Information */}
      <div className="flex justify-center items-center gap-2 mb-8">
        <div className="flex-col justify-center items-center text-center gap-3">
          <div className="w-10 h-10 md:w-12 md:w-12 mx-10 mb-4">
            <SeatStandard />
          </div>
          <span className="text-base text-gray-700">Standard</span>
          <p className="text-xs md:text-sm">320 THB</p>
        </div>
        <div className="flex-col text-sm md:text-xl justify-center items-center text-center gap-3">
          <div className="w-10 h-10 md:w-12 md:w-12 mx-10 mb-4">
            <SeatPremium />
          </div>
          <span className="text-base text-gray-700">Premium</span>
          <p className="text-xs md:text-sm">350 THB</p>
        </div>
      </div>

      {/* Seat Layout */}
      <div className="flex justify-between">
        <div className="w-full overflow-x-auto">
          {/* Screen */}
          <div className="relative justify-center mb-10 text-center">
            <img
              alt="screen"
              src="/uploads/screen.svg"
              className="w-full md:w-full md:h-24 h-12 mx-auto"
            />
            <span className="absolute top-6 left-1/2 transform -translate-x-1/2 text-gray-800 font-semibold text-sm sm:text-base">
              SCREEN
            </span>
          </div>

          {/* Seats */}
          <div className="flex justify-around gap-4">
            {/* Left Section */}
            <div className="space-y-2">
              {rows.map((row) => (
                <div key={row} className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium w-6 text-center">{row}</span>
                  <div className="flex gap-1">
                    {Array(seatsPerRow / 2)
                      .fill(null)
                      .map((_, index) =>
                        premiumRows.includes(row) ? (
                          <div className="md:h-8 md:w-8 h-5 w-5" key={index}>
                            <SeatPremium />
                          </div>
                        ) : (
                          <div className="md:h-8 md:w-8 h-5 w-5" key={index}>
                            <SeatStandard />
                          </div>
                        )
                      )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Section */}
            <div className="space-y-2">
              {rows.map((row) => (
                <div key={row} className="flex items-center gap-2 justify-end">
                  <div className="flex gap-1">
                    {Array(seatsPerRow / 2)
                      .fill(null)
                      .map((_, index) =>
                        premiumRows.includes(row) ? (
                          <div className="md:h-8 md:w-8 h-5 w-5" key={index}>
                            <SeatPremium />
                          </div>
                        ) : (
                          <div className="md:h-8 md:w-8 h-5 w-5" key={index}>
                            <SeatStandard />
                          </div>
                        )
                      )}
                  </div>
                  <span className="text-gray-600 font-medium w-6 text-center">{row}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel (for Desktop) */}
        <div className="w-1/4 bg-white p-6 rounded-lg shadow-md hidden md:block">
            <div className="p-2">
                <h3 className="text-base font-bold text-gray-800">Captain America : Brave New World</h3>
                <p className="text-sm text-blue-600">19 February 2025</p>
                <p className="text-sm text-blue-600">12:00</p>
            </div>
            <div className="p-2 mt-4">
                <h3 className="text-base font-bold text-gray-800">CINEMA 4</h3>
                <p className="text-sm text-blue-600">Emprive' Cineclub Emporium Sukhumvit</p>
            </div>


        
          <div className="bg-gray-100 rounded-xl p-4 w-full items-center text-center justify-center mt-12 ">

            <h3 className="text-sm font-bold text-gray-800">Selected Seat</h3>

            <div className="mb-4">

            </div>

            <h3 className="text-sm font-bold text-gray-800 mt-16 mb-12">Total</h3>


            <button className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg">
                Continue
            </button>
          </div>
          
        </div>

        {/* Fixed Bottom Panel (for Mobile) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-lg border-t-2 border-gray-300 md:hidden">
          <div className="flex justify-between items-center">
            <div className="text-xl text-gray-800 font-semibold">Selected Seat</div>
            <div className="text-xl text-gray-700">0 THB</div>
          </div>
          <div className="flex justify-between mt-4">
            <button className="text-white bg-blue-500 w-full py-2 rounded-lg">
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinemaSeatBooking;