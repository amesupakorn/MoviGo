"use client";

import React, { useEffect, useState } from "react";
import { Location } from "@/lib/types/booking";
import api from "@/lib/axios";
import Link from "next/link";
import LoadTwo from "@/app/components/ui/loading/loadTwo";

const LocationPage = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/location");
        const data = response.data;
        setLocations(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("An error occurred while fetching locations.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (isLoading) {
      return <LoadTwo />;
  }

  return (
    <div>
      <div
        className="w-auto h-[150px] max-sm:h-[150px] sm:h-[150px] md:h-[200px] lg:h-[350px] bg-cover bg-top relative inset-0 flex flex-col justify-center max-sm:mt-[40px] md:mt-[80px] lg:mt-24"
        style={{ backgroundImage: `url("/uploads/cinema3.jpeg")` }}
      >
      </div>
       
      <div className="container mx-auto max-w-5xl p-6">

      <div className="flex items-center mb-6">
        {/* Step 1 */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 rounded-full bg-amber-500 border border-amber-400 text-white flex items-center justify-center shadow-md shadow-amber-200">
            1
          </div>
          <h3 className="text-amber-600 md:text-base text-xs">Select Location</h3>
        </div>

        {/* Line between steps */}
        <div className="flex-1 h-1 transform -translate-y-4 bg-gray-300"></div>

        {/* Step 2 */}
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 bg-white text-gray-400 border-gray-400 border-2 rounded-full flex items-center justify-center">
            2
          </div>
          <h3 className="text-amber-600 md:text-base text-xs">Select Showtime</h3>
        </div>

        {/* Line between steps */}
        <div className="flex-1 h-1 transform -translate-y-4 bg-gray-300"></div>

        {/* Step 3 */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 bg-white text-gray-400 border-gray-400 border-2 rounded-full flex items-center justify-center">
            3
          </div>
          <h3 className="text-amber-600 md:text-base text-xs">Select Seat</h3>
        </div>
      </div>

        <div className="flex flex-col space-y-4">
          {locations.map((location) => (
            <Link  key={location.id}  href={`cinemas/${location.id}`}>
                <div
                  key={location.id}
                  className="bg-white p-6 shadow-md hover:shadow-lg transition-shadow flex justify-between cursor-pointer hover:bg-gray-100 border border-gray-200 border-[1px]"
                >
                  <h2 className="text-xl sm:text-lg max-sm:text-sm font-bold mb-2">{location.name}</h2>
                  <p className="text-gray-600 text-sm max-sm:text-xs">{location.address}</p>
                </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default LocationPage;