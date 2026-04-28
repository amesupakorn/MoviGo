"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Location } from "@/lib/types/booking";
import { useParams } from "next/navigation";
import LoadTwo from "@/app/components/ui/loading/loadTwo";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Volume2,
  Calendar as CalendarIcon,
  Monitor,
  Info
} from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Link from "next/link";

export default function LocationDetailPage() {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const { id } = useParams();
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today.clone());
  const [startIndex, setStartIndex] = useState(0);
  const [moviePosters, setMoviePosters] = useState<{ [key: string]: string }>({});

  const userTimezone = dayjs.tz.guess();

  const getVisibleDaysCount = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width < 640) return 3;
      if (width < 1024) return 5;
      return 7;
    }
    return 7;
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleDaysCount());
  const next30Days = Array.from({ length: 30 }, (_, index) => today.add(index, "day"));
  const visibleDays = next30Days.slice(startIndex, startIndex + visibleCount);

  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleDaysCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/location/${id}`);
        setLocation(response.data);
      } catch {
        setError("Failed to fetch location details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocation();
  }, [id]);

  useEffect(() => {
    const fetchPosters = async () => {
      if (!location) return;
      const posters: { [key: string]: string } = {};
      await Promise.all(
        location.subCinemas.flatMap((cinema) =>
          cinema.showtimes.map(async (showtime) => {
            if (showtime.movie.id && !posters[showtime.movie.id]) {
              try {
                const movieResponse = await api.get(`/movies/${showtime.movie.id}`);
                posters[showtime.movie.id] = movieResponse.data.poster_path;
              } catch (error) {
                console.error("Error fetching movie poster:", error);
              }
            }
          })
        )
      );
      setMoviePosters(posters);
    };
    fetchPosters();
  }, [location]);

  if (isLoading) return <LoadTwo />;
  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-[2rem] border border-red-100">
      <Info className="w-12 h-12 text-red-500 mb-4" />
      <p className="text-red-900 font-bold">{error}</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-600 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Branch Details</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{location?.name}</h1>
          <p className="text-slate-500 font-medium mt-1">{location?.address}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href={`/admin/cinema/${id}`}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center shadow-lg shadow-slate-900/10"
          >
            Manage Cinemas
          </Link>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
        <button
          className={`p-3 rounded-2xl transition-all ${startIndex > 0 ? "text-slate-900 hover:bg-slate-50" : "text-slate-200 cursor-not-allowed"}`}
          onClick={() => setStartIndex((prev) => Math.max(prev - 1, 0))}
          disabled={startIndex === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex-grow flex justify-center items-center space-x-2 sm:space-x-4">
          {visibleDays.map((date, index) => {
            const isSelected = selectedDate.isSame(date, "day");
            const isToday = index + startIndex === 0;
            return (
              <button
                key={index}
                onClick={() => setSelectedDate(dayjs(date))}
                className={`flex flex-col items-center justify-center min-w-[70px] sm:min-w-[100px] py-3 rounded-2xl transition-all duration-200 ${isSelected
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20 scale-105 z-10"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isSelected ? "text-white/80" : "text-slate-400"}`}>
                  {isToday ? "Today" : date.format("ddd")}
                </span>
                <span className="text-sm font-black">
                  {date.format("D MMM")}
                </span>
              </button>
            );
          })}
        </div>

        <button
          className={`p-3 rounded-2xl transition-all ${startIndex + visibleCount < next30Days.length ? "text-slate-900 hover:bg-slate-50" : "text-slate-200 cursor-not-allowed"}`}
          onClick={() => setStartIndex((prev) => prev + 1)}
          disabled={startIndex + visibleCount >= next30Days.length}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Showtimes Grid */}
      <div className="space-y-6">
        {location?.subCinemas
          .filter(cinema =>
            cinema.showtimes.some(showtime => dayjs(showtime.date).isSame(selectedDate, "day"))
          )
          .map((cinema) => {
            const filteredShowtimes = cinema.showtimes.filter(showtime =>
              dayjs(showtime.date).tz(userTimezone).format("YYYY-MM-DD") === selectedDate.tz(userTimezone).format("YYYY-MM-DD")
            );

            const movieIds = [...new Set(filteredShowtimes.map(showtime => showtime.movie.id))];

            return (
              <div key={cinema.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{cinema.name}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cinema.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-100">
                      <Volume2 className="w-3.5 h-3.5 mr-2" />
                      ENG / TH SUB
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {movieIds.map(movieId => {
                    const movieShowtimes = filteredShowtimes.filter(s => s.movie.id === movieId);
                    const firstShowtime = movieShowtimes[0];
                    const posterPath = moviePosters[movieId];

                    return (
                      <div key={movieId} className="flex flex-col lg:flex-row gap-8 items-start lg:items-center last:mb-0 mb-8 border-b border-slate-50 pb-8 last:border-0 last:pb-0">
                        {/* Poster */}
                        <div className="w-24 sm:w-32 flex-shrink-0">
                          <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                            <img
                              src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                              alt={firstShowtime?.movie.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Details & Showtimes */}
                        <div className="flex-grow space-y-4">
                          <div>
                            <h4 className="text-xl font-black text-slate-900 leading-tight mb-2">
                              {firstShowtime?.movie.title}
                            </h4>
                            <div className="flex flex-wrap gap-4 items-center">
                              <div className="flex items-center text-xs font-bold text-slate-400">
                                <Clock className="w-3.5 h-3.5 mr-1.5" />
                                {firstShowtime?.movie.duration} MINS
                              </div>
                              <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                              <div className="text-[10px] font-black px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase tracking-tighter">
                                ACTION / SCI-FI
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            {movieShowtimes.map((showtime) => {
                              const formattedTime = showtime.time.split(":").slice(0, 2).join(":");
                              const showtimeMoment = dayjs(`${selectedDate.format("YYYY-MM-DD")} ${formattedTime}`, "YYYY-MM-DD HH:mm");
                              const isPast = showtimeMoment.isBefore(dayjs());

                              return (
                                <Link key={showtime.id} href={`/admin/showtimeSeat/${showtime.id}`}>
                                  <div className={`px-6 py-3 rounded-2xl font-bold transition-all border ${isPast
                                      ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                                      : "bg-white border-amber-200 text-amber-600 hover:bg-amber-500 hover:text-white hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95"
                                    }`}>
                                    {formattedTime}
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

        {location?.subCinemas.every(cinema =>
          !cinema.showtimes.some(showtime => dayjs(showtime.date).isSame(selectedDate, "day"))
        ) && (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <CalendarIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-900 font-bold text-lg">No showtimes scheduled</p>
              <p className="text-slate-500 font-medium">There are no movies playing at this location on the selected date.</p>
            </div>
          )}
      </div>
    </div>
  );
}
