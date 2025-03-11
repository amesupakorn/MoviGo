"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Location } from "@/lib/types/booking";
import { useParams } from "next/navigation";
import LoadTwo from "@/app/components/ui/loading/loadTwo";
import { FaCaretRight,FaCaretLeft, FaVolumeUp } from "react-icons/fa";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { IoIosTimer } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import Link from "next/link";
import { IoLocationSharp } from "react-icons/io5";


const LocationDetailPage = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const { id } = useParams();
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // วันที่ปัจจุบัน
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today.clone());
  const [startIndex, setStartIndex] = useState(0); // ตำแหน่งเริ่มต้นของวันที่แสดง
  const [selectedTime, setSelectedTime] = useState("15:00");
  const [moviePosters, setMoviePosters] = useState<{ [key: string]: string }>({});

  const userTimezone = dayjs.tz.guess();

  //ปรับจำนวนปุ่มวันที่ตามขนาดหน้าจอ
  const getVisibleDaysCount = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width < 500) return 2;
      if (width < 640) return 3; // max-sm
      if (width < 768) return 4; // sm
      if (width < 1024) return 5; // md
      return 6; // lg ขึ้นไป
    }
    return 6; // ค่าเริ่มต้น
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleDaysCount());
  const next30Days = Array.from({ length: 30 }, (_, index) => today.add(index, "day"));
  const visibleDays = next30Days.slice(startIndex, startIndex + visibleCount);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleDaysCount());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
  if (error) return <div className="text-red-500">{error}</div>;




  return (
    <div>
      <div
        className="w-auto h-[150px] max-sm:h-[150px] sm:h-[150px] md:h-[200px] lg:h-[280px] bg-cover bg-top relative inset-0 flex flex-col justify-center max-sm:mt-[40px] md:mt-[80px] lg:mt-24"
        style={{ backgroundImage: `url("/uploads/cinema2.jpg")` }}
      ></div>
      <div className="container mx-auto max-w-5xl p-6">
      

        <div className="flex items-center mb-6">
        {/* Step 1 */}
        <div className="flex flex-col items-center justify-center space-y-4">
        <Link href={`/client/cinemas/`}>
          <div className="w-10 h-10 rounded-full bg-amber-500 border border-amber-400 text-white flex items-center justify-center ">
          <FaCheck />
          </div>
          </Link>
          <h3 className="text-amber-600 md:text-base text-xs">Select Location</h3>
        </div>

        {/* Line between steps */}
        <div className="flex-1 h-1 transform -translate-y-4 bg-gradient-to-r from-amber-500 to-amber-200 "></div>

        {/* Step 2 */}
        <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full bg-amber-500 border border-amber-400 text-white flex items-center justify-center shadow-md shadow-amber-200">
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

        {/* ปุ่มเลือกวัน */}
        <div className="flex justify-center space-x-5 overflow-x-auto mb-6 w-full">
          {/* ปุ่มเลื่อนไปซ้าย */}
          {startIndex > 0 && (
            <button className="text-2xl text-white hover:text-amber-500 transition duration-200"
              onClick={() => setStartIndex((prev) => Math.max(prev - 1, 0))}>
              <FaCaretLeft />
            </button>
          )}

          {visibleDays.map((date, index) => {
            const isSelected = selectedDate.isSame(date, "day");
            return (
              <button
                key={index}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-100 ${
                  isSelected
                    ? "border-amber-500 text-amber-500"
                    : "border-gray-300 text-gray-200 bg-transparent hover:border-amber-500 hover:text-amber-500"
                }`}
                onClick={() => setSelectedDate(dayjs(date))}
              >
                {/* แสดง "Today" เฉพาะเมื่อ index + startIndex === 0 (วันที่แรก) */}
                {index + startIndex === 0 ? "Today" : date.locale("en").format("D MMM YYYY")}
              </button>
            );
          })}

          {/* ปุ่มเลื่อนไปขวา */}
          {startIndex + 6 < next30Days.length && (
            <button
              className="text-3xl text-white  hover:text-amber-500 transition duration-200"
              onClick={() => setStartIndex((prev) => prev + 1)}
            >
              <FaCaretRight />
            </button>
          )}
        </div>


        {/* ส่วนเลือกรอบหนัง */}
        <div className="grid grid-cols-1 gap-6">
        {location?.subCinemas.map((cinema) => {
        const showtimesForDate = cinema.showtimes.filter(showtime =>
          dayjs(showtime.date).isSame(selectedDate, "day")
        );

        if (showtimesForDate.length === 0) return null;

        return (
          <div key={cinema.id} className="bg-zinc-800 p-6 shadow-md border border-gray-300 rounded-3xl mb-6">

            {/* ✅ แยกตามหนังที่ฉายในโรงนี้ */}
            {Object.entries(
              showtimesForDate.reduce((acc: { [key: string]: any[] }, showtime) => {
                if (!acc[showtime.movie.id]) acc[showtime.movie.id] = [];
                acc[showtime.movie.id].push(showtime);
                return acc;
              }, {})
            ).map(([movieId, movieShowtimes]) => {
              const firstShowtime = movieShowtimes[0];
              const posterPath = moviePosters[movieId];

              return (
                <div key={movieId} className="max-w-5xl w-full">
                  <div className="grid grid-cols-1 grid-cols-[auto_1fr] gap-4 md:gap-6 items-start">
                    {posterPath && (
                      <div className="w-full max-w-[80px] sm:max-w-[100px] md:max-w-[120px]">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                          alt={firstShowtime.movie.title}
                          className="w-full h-auto object-cover rounded-lg"
                        />
                      </div>
                    )}

                    <div className="flex flex-col justify-start md:justify-between">
                      <div className="mb-2 md:mb-4">
                        <p className="md:text-lg text-sm sm:text-xl md:text-2xl lg:text-2xl font-bold text-white mb-1">
                          {firstShowtime.movie.title}
                        </p>
                        <div className="flex md:flex-col md:text-base text-xs md:gap-0 gap-2">
                          <span className="mt-1 text-amber-500 flex items-center">
                            <IoLocationSharp className="mr-1"/>
                            {location.name}
                          </span>
                      
                          <span className="mt-1 text-amber-400 flex items-center">
                            <IoIosTimer className="mr-1" />
                            {firstShowtime.movie.duration} mins
                          </span>
                        </div>

                        <Link href={`/client/movie/${firstShowtime.movie.id}`}>
                          <button className="md:mt-10 mt-5 md:px-8 py-2 px-6 border border-gray-300 md:text-base text-xs text-gray-300 rounded-lg hover:border-gray-400 hover:text-gray-400 transition-colors duration-300 ">
                            Movie Details
                          </button>
                        </Link>
                        
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 max-sm:mt-4 mb-4">
                  {/* ✅ ปุ่มเลือกรอบที่ถูกต้อง */}
                  <div className="border-t border-gray-200 pt-4 flex items-center gap-4">
                    {/*ชื่อโรงภาพยนตร์ */}
                    <p className="text-sm sm:text-sm md:text-lg lg:text-lg font-bold text-gray-100">
                      <strong>{cinema.name}</strong>
                    </p>

                    <div className="h-5 w-px bg-gray-300"></div>

                    {/*ประเภทโรง */}
                    <p className="text-sm sm:text-sm md:text-lg lg:text-lg text-gray-100 font-bold">{cinema.type}</p>

                    <div className="h-5 w-px bg-gray-300"></div>

                    {/*ภาษา */}
                    <div className="flex items-center gap-2">
                      <FaVolumeUp className="text-gray-100" />
                      <span className="text-sm text-gray-100">ENG</span>
                      <span className="border px-1 text-xs text-gray-100">SUB</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {(() => {
                      const upcomingShowtimes = movieShowtimes.filter(showtime =>
                        dayjs(`${selectedDate.format("YYYY-MM-DD")} ${showtime.time}`, "YYYY-MM-DD HH:mm").isAfter(dayjs())
                      );
                      const nearestShowtime = upcomingShowtimes.length > 0 ? upcomingShowtimes[0].time : null;

                      return movieShowtimes.map((showtime) => {
                        const isNearest = showtime.time === nearestShowtime;
                        const isPast = dayjs(`${selectedDate.format("YYYY-MM-DD")} ${showtime.time}`, "YYYY-MM-DD HH:mm").isBefore(dayjs());
                        return (
                          <Link key={showtime.id} href={`/client/showtime/${showtime.id}`}>
                            <button
                              className={`transition-colors duration-300 rounded-md border transition-all text-lg font-medium
                                              px-3 py-0.5 text-[14px] 
                                              sm:px-6 sm:py-2 sm:text-[15px] 
                                              md:px-8 md:py-2 md:text-[16px] ${
                                isPast
                                  ? "bg-gray-500 text-gray-400 cursor-not-allowed"
                                  : isNearest
                                  ? "bg-gradient-to-r from-amber-500 to-amber-300 text-white"
                                  : selectedTime === showtime.time
                                  ? "border-amber-500 text-amber-500 bg-amber-100"
                                  : "border-amber-500 text-amber-500 hover:bg-amber-100"
                              }`}
                              onClick={() => !isPast && setSelectedTime(showtime.time)}
                              disabled={isPast}
                            >
                              {showtime.time}
                            </button>
                          </Link>
                        );
                      });
                    })()}
                  </div>
                </div>
                </div>
              );
            })}
          </div>
        );
      })}
      </div>
    
        
      </div>
  </div>
  )}
  
export default LocationDetailPage;