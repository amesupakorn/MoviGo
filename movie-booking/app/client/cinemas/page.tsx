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
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Cinemas Locations</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
        

        <div className="flex flex-col space-y-4">
          {locations.map((location) => (
            <Link  key={location.id}  href={`cinemas/${location.id}`}>

                <div
                  key={location.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-xl font-bold mb-2">{location.name}</h2>
                  <p className="text-gray-600">{location.address}</p>
                </div>
            </Link>
          ))}
          
        </div>
      
    </div>
  );
};

export default LocationPage;