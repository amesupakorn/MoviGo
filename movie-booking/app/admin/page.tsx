"use client";

import React, { useEffect, useState } from "react";
import { Location } from "@/lib/types/booking";
import api from "@/lib/axios";
import Link from "next/link";
import LoadTwo from "@/app/components/ui/loading/loadTwo";
import {
  MapPin,
  ChevronRight,
} from "lucide-react";

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
      } catch {
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Dashboard</h1>
        <p className="text-slate-500 font-medium mt-1">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
      </div>


      {/* Locations Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 lg:p-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Manage Locations</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Select a location to manage its showtimes and cinemas.</p>
          </div>
          <Link
            href="/admin/location"
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center shadow-lg shadow-slate-900/10"
          >
            Add New Location
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations.map((location) => (
            <Link key={location.id} href={`/admin/adminShowtime/${location.id}`}>
              <div className="group relative bg-slate-50 p-6 rounded-[2rem] border border-transparent hover:border-amber-200 hover:bg-white hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300 flex items-center justify-between">
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-amber-500 group-hover:border-amber-100 transition-all shadow-sm">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{location.name}</h3>
                    <p className="text-slate-500 text-sm font-medium line-clamp-1">{location.address}</p>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-white shadow-sm border border-slate-100 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {locations.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <MapPin className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-900 font-bold">No locations found</p>
            <p className="text-slate-500 text-sm mt-1">Get started by creating your first cinema location.</p>
          </div>
        )}
      </div>
    </div>
  );
}