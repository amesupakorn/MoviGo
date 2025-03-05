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

  // ✅ ปรับจำนวนปุ่มวันที่ตามขนาดหน้าจอ
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
      
      <div className="container mx-auto max-w-5xl p-6">

        {/* ปุ่มเลือกวัน */}
        <div className="flex justify-center space-x-5 overflow-x-auto mb-6 w-full">
          {/* ปุ่มเลื่อนไปซ้าย */}
          {startIndex > 0 && (
            <button className="text-2xl text-gray-700 hover:text-amber-500 transition duration-200"
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
                    : "border-gray-700 text-gray-700 bg-transparent hover:border-amber-500 hover:text-amber-500"
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
              className="text-3xl text-gray-700  hover:text-amber-500 transition duration-200"
              onClick={() => setStartIndex((prev) => prev + 1)}
            >
              <FaCaretRight />
            </button>
          )}
        </div>


        {/* ส่วนเลือกรอบหนัง */}
        <div className="grid grid-cols-1 gap-6">
        {location?.subCinemas
          .filter(cinema => 
            cinema.showtimes.some(showtime => 
              dayjs(showtime.date).isSame(selectedDate, "day")
            ))
          .map((cinema) => {
            // ✅ กรองเฉพาะ `showtimes` ของวันที่เลือก
            const filteredShowtimes = cinema.showtimes.filter(showtime =>
              dayjs(showtime.date).tz(userTimezone).format("YYYY-MM-DD") === selectedDate.tz(userTimezone).format("YYYY-MM-DD")
            );

            // ✅ ดึงรายการ `movieId` ที่ไม่ซ้ำกัน
            const movieIds = [...new Set(filteredShowtimes.map(showtime => showtime.movie.id))];
            
            return (
              <div key={cinema.id} className="bg-white p-6 shadow-md border border-gray-400 rounded-3xl">

                {/* ✅ แสดงแยกเป็นแต่ละหนัง */}
                {movieIds.map(movieId => {
                  const movieShowtimes = filteredShowtimes.filter(s => s.movie.id === movieId);
                  const firstShowtime = movieShowtimes.length > 0 ? movieShowtimes[0] : null;
                  const posterPath = firstShowtime ? moviePosters[movieId] : null;

                  return (
                    <div key={movieId} className="max-w-5xl w-full">

                      {/* ✅ โปสเตอร์หนัง&รายละเอียดหนัง */}
                      <div className="grid grid-cols-1 grid-cols-[auto_1fr] gap-4 md:gap-6 items-start">
                        
                        {/* ✅ โปสเตอร์หนัง */}
                        {posterPath && (
                          <div className="w-full max-w-[80px] sm:max-w-[100px] md:max-w-[120px]">
                            <img
                              src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                              alt={firstShowtime?.movie.title || "Movie Poster"}
                              className="w-full h-auto object-cover rounded-lg"
                            />
                          </div>
                        )}

                      
                        {/* ✅ รายละเอียดหนังและรอบฉาย */}
                        <div className="flex flex-col justify-start md:justify-between">
                          {firstShowtime && (
                            <div className="mb-2 md:mb-4">
                              <p className="text-gray-800 md:text-lg font-bold mb-1">
                                {firstShowtime.movie.title}
                              </p>

                                <div className="flex text-sm gap-4">
                                  <span className="mt-1 text-amber-500 flex items-center">
                                    <IoLocationSharp className="mr-1"/>
                                    {location.name}
                                  </span>
                      
                                  <span className="mt-1 text-amber-500 flex items-center">
                                    <IoIosTimer className="mr-1" />
                                    {firstShowtime.movie.duration} mins
                                  </span>
                                </div>

                                <div className="border-t border-gray-200 pt-4 flex items-center gap-4 mt-2">
                                  {/* ✅ ชื่อโรงภาพยนตร์ */}
                                  <p className="text-sm font-bold text-gray-800">
                                    <strong>{cinema.name}</strong>
                                  </p>

                                  <div className="h-5 w-px bg-gray-300"></div>

                                  {/* ✅ ประเภทโรง */}
                                  <p className="text-sm text-gray-800 font-bold">{cinema.type}</p>

                                  <div className="h-5 w-px bg-gray-300"></div>

                                  {/* ✅ ภาษา */}
                                  <div className="flex items-center gap-2 text-xs">
                                    <FaVolumeUp className="text-gray-800" />
                                    <span className="text-gray-800">ENG</span>
                                    <span className="border px-1 text-gray-800">SUB</span>
                                  </div>
                                </div>

                                <div className="mt-4 flex gap-2">
                                {(() => {
                                        // ✅ ค้นหา showtime ที่ใกล้ที่สุด (>= เวลาปัจจุบัน)
                                  const upcomingShowtimes = filteredShowtimes.filter(showtime =>
                                  dayjs(`${selectedDate.format("YYYY-MM-DD")} ${showtime.time.split(":").slice(0, 2).join(":")}`, "YYYY-MM-DD HH:mm")
                                  .isAfter(dayjs())
                                  );
                                  const nearestShowtime = upcomingShowtimes.length > 0 ? upcomingShowtimes[0].time : null;

                                  return filteredShowtimes.map((showtime) => {
                                  // ✅ แปลงเวลา showtime.time และตรวจสอบกับเวลาปัจจุบัน
                                  const formattedTime = showtime.time.split(":").slice(0, 2).join(":");
                                  const showtimeMoment = dayjs(`${selectedDate.format("YYYY-MM-DD")} ${formattedTime}`, "YYYY-MM-DD HH:mm");
                                  const isPast = showtimeMoment.isBefore(dayjs()); // ✅ เช็คว่าเวลาหมดหรือยัง
                                  const isNearest = showtime.time === nearestShowtime; // ✅ เช็คว่าเป็นเวลาล่าสุดที่กำลังจะถึงไหม
                                  const uniqueKey = `${cinema.id}-${showtime.id}`; // ✅ ป้องกัน key ซ้ำ

                                  return (
                                    <Link key={uniqueKey} href={`/admin/showtimeSeat/${showtime.id}`}>
                                      <button
                                        key={uniqueKey}
                                        className={`transition-colors duration-300 rounded-md border transition-all text-lg font-medium
                                                    px-3 py-0.5 text-[11px] 
                                                    md:px-6 sm:py-2 sm:text-[15px] 
                                                    md:px-8 md:py-2 md:text-[16px] ${
                                                    isPast
                                                      ? "bg-gray-300 text-gray-400 cursor-not-allowed" // ❌ เวลาที่หมดแล้ว
                                                      : isNearest
                                                      ? "bg-gradient-to-r from-amber-500 to-amber-300 text-white" // ✅ ปุ่มที่ใกล้ที่สุด 
                                                      : selectedTime === showtime.time
                                                      ? "border-amber-500 text-amber-500  bg-amber-100" // ✅ ปุ่มที่ถูกเลือก แต่ไม่ใช่ nearest
                                                      : "border-amber-500 text-amber-500  hover:bg-amber-100" // 🟡 ปุ่มปกติที่ hover ได้
                                        }`}
                                        onClick={() => !isPast && setSelectedTime(showtime.time)} 
                                        disabled={isPast}
                                        >
                                        {formattedTime}
                                      </button>
                                    </Link>
                                    );
                                    });
                                  })()}
                              </div>
                              
                            </div>
                          )}
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
