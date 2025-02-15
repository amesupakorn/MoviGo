"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Location } from "@/lib/types/booking";
import { useParams } from "next/navigation";
import LoadTwo from "@/app/components/ui/loading/loadTwo";

const LocationDetailPage = () => {
  const { id } = useParams();

  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/location/${id}`);
        setLocation(response.data);
      } catch (err) {
        setError("Failed to fetch location details.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  if (isLoading) return <LoadTwo/> ;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">{location?.name}</h1>
      <p className="text-center text-gray-600 mb-6">{location?.address}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {location?.subCinemas.map((cinema) => (
          <div
            key={cinema.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-bold mb-4">{cinema.name}</h2>
            <p className="text-gray-500 mb-4">Type: {cinema.type}</p>

            <div>
              <h3 className="text-lg font-semibold mb-4">Showtimes:</h3>
              <div className="grid grid-cols-1 gap-4">
                {cinema.showtimes.length > 0 ? (
                  cinema.showtimes.map((showtime) => (
                    <div
                      key={showtime.id}
                      className="bg-gray-100 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow"
                    >
                      <p className="text-sm text-gray-700 mb-1">
                       Time: {showtime.time}
                      </p>
                      <p className="text-sm text-gray-700 mb-1">
                        <strong>Movie:</strong> {showtime.movie.title}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Duration:</strong> {showtime.movie.duration} mins
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No showtimes available</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationDetailPage;