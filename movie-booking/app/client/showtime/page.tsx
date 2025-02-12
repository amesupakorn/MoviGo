"use client";
import React from "react";
import SeatStandard from "@/app/components/ui/seat/standard";
import SeatPremium from "@/app/components/ui/seat/premium";

const CinemaSeatBooking = () => {
  const rows = ["M", "L", "K", "J", "H", "G", "F", "E", "D", "C", "B", "A"]; // Reversed rows
  const seatsPerRow = 12;
  const premiumRows = ["A", "B", "C", "D", "E", "F"]; // Premium rows

  return (
    <div className="min-h-screen bg-gray-100 p-6">
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
        <div className="flex-col md:text-xl justify-center items-center text-center gap-3">
            <div className="w-10 h-10 md:w-12 md:w-12 mx-10">
                <SeatStandard />
            </div>
                <span className="text-base text-gray-700">Standard</span>
                <p className="text-xs md:text-sm">320 THB</p>
            </div>
            <div className="flex-col text-sm md:text-xl justify-center items-center text-center gap-3">
            <div className="w-10 h-10 md:w-12 md:w-12 mx-10">
                <SeatPremium />
            </div>
            <span className="text-base text-gray-700">Premium</span>
            <p className="text-xs md:text-sm">350 THB</p>
            </div>
            
      </div>

      {/* Seat Layout */}

      <div className="md:max-w-full mx-auto p-6 overflow-x-auto">
        {/* Screen */}
        <div className="justify-around w-[350px] md:w-full">
            <div className="relative justify-center mb-10 text-center ">
                <img
                alt="screen"
                src="/uploads/screen.svg"
                className="md:w-full md:h-32 h-12 mx-auto"
                />
                <span className="absolute top-6 left-1/2 transform -translate-x-1/2 text-gray-800 font-semibold text-sm sm:text-base">
                SCREEN
            </span>
        </div>
    
        </div>
       
        {/* Seats */}
        <div className="flex justify-around md:justify-center gap-4 md:gap-24">
            {/* Left Section */}
            <div className="space-y-2">
            {rows.map((row) => (
                <div key={row} className="flex items-center gap-2">
                <span className="text-gray-600 font-medium w-6 text-center">
                    {row}
                </span>
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
                <span className="text-gray-600 font-medium w-6 text-center">
                    {row}
                </span>
                </div>
            ))}
            </div>
        </div>
        </div>
      </div>
  );
};

export default CinemaSeatBooking;