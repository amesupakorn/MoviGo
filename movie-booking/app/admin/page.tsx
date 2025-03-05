"use client";

import React, { useEffect, useState } from "react";
import { Location } from "@/lib/types/booking";
import api from "@/lib/axios";
import Link from "next/link";
import LoadTwo from "@/app/components/ui/loading/loadTwo";

export default function Page() {
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
    <div className="container mx-auto max-w-5xl p-6">
        <div className="flex flex-col space-y-3">

        <p className="text-2xl font-bold">Location</p>
          {locations.map((location) => (
            <Link  key={location.id}  href={`/admin/adminShowtime/${location.id}`}>
                <div
                  key={location.id}
                  className="bg-white p-6 border border-gray-300 border-[1px] rounded-3xl flex justify-between cursor-pointer hover:bg-gray-100"
                >
                  <h2 className="text-black text-sm font-bold mb-2">{location.name}</h2>
                  <p className="text-gray-600 text-sm max-sm:text-xs">{location.address}</p>
                </div>
            </Link>
          ))}
        </div>
    </div>
    )
}