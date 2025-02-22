"use client";

import React, { useEffect, useState } from "react";
import { Location } from "@/lib/types/booking";
import api from "@/lib/axios";
import Link from "next/link";
import LoadTwo from "@/app/components/ui/loading/loadTwo";

const LocationPage = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        className="w-auto h-[150px] max-sm:h-[150px] sm:h-[150px] md:h-[200px] lg:h-[200px] bg-cover bg-top relative inset-0 flex flex-col justify-center max-sm:mt-[40px] md:mt-[80px] lg:mt-24"
        style={{ backgroundImage: `url("/uploads/cinema.jpg")` }}
      >
      </div>
       
      <div className="container mx-auto max-w-5xl p-6">

        <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl max-sm:text-2xl sm:text-2xl md:text-3xl font-bold">Cinemas Locations</h1>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="flex items-center mb-6">
              <div className="w-14 h-8 bg-blue-300 text-white rounded-full flex items-center justify-center">1</div>
              <div className="w-full h-2 bg-gray-300"></div>
              <div className="w-14 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center">2</div>
              <div className="w-full h-2 bg-gray-300"></div>
              <div className="w-14 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center">3</div>
        </div>
          

        <div className="flex flex-col space-y-4">
          {locations.map((location) => (
            <Link  key={location.id}  href={`cinemas/${location.id}`}>
                <div
                  key={location.id}
                  className="bg-white p-6 shadow-md hover:shadow-lg transition-shadow flex justify-between cursor-pointer hover:bg-gray-100 border border-gray-200 border-[1px]"
                >
                  <h2 className="text-xl font-bold mb-2">{location.name}</h2>
                  <p className="text-gray-600">{location.address}</p>
                </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default LocationPage;