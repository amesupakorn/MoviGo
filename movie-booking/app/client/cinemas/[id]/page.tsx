"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Location } from "@/lib/types/booking";
import { useParams } from "next/navigation";
import LoadTwo from "@/app/components/ui/loading/loadTwo";
import { FaCaretRight,FaCaretLeft, FaVolumeUp } from "react-icons/fa";
import { Movie } from "@/lib/types/movie";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";


const LocationDetailPage = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const { id } = useParams();
  const [location, setLocation] = useState<Location | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // วันที่ปัจจุบัน
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today.clone());
  const [startIndex, setStartIndex] = useState(0); // ตำแหน่งเริ่มต้นของวันที่แสดง
  const [selectedTime, setSelectedTime] = useState("15:00");
  const [moviePosters, setMoviePosters] = useState<{ [key: string]: string }>({});

  const userTimezone = dayjs.tz.guess();

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

  // สร้างวันที่ล่วงหน้า 30 วัน
  const next30Days = Array.from({ length: 30 }, (_, index) => today.add(index, "day"));

  // จำกัดให้แสดงทีละ 6 วัน
  const visibleDays = next30Days.slice(startIndex, startIndex + 6);



  return (
    <div>
      <div
        className="w-auto h-[150px] max-sm:h-[150px] sm:h-[150px] md:h-[200px] lg:h-[200px] bg-cover bg-top relative inset-0 flex flex-col justify-center max-sm:mt-[40px] md:mt-[80px] lg:mt-24"
        style={{ backgroundImage: `url("/uploads/cinema.jpg")` }}
      ></div>

      <div className="container mx-auto max-w-5xl p-6">

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl max-sm:text-2xl sm:text-2xl md:text-3xl font-bold">{location?.name}</h1>
        </div>

        <div className="flex items-center mb-6">
              <div className="w-14 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">1</div>
              <div className="w-full h-2 bg-blue-300"></div>
              <div className="w-14 h-8 bg-blue-300 text-white rounded-full flex items-center justify-center">2</div>
              <div className="w-full h-2 bg-gray-300"></div>
              <div className="w-14 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center">3</div>
        </div>

        {/* ปุ่มเลือกวัน */}
        <div className="flex justify-center space-x-5 overflow-x-auto mb-6 w-full">
          {/* ปุ่มเลื่อนไปซ้าย */}
          {startIndex > 0 && (
            <button
              className="text-3xl hover:text-blue-500 transition duration-200"
              onClick={() => setStartIndex((prev) => Math.max(prev - 1, 0))}
            >
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
                    ? "border-blue-500 text-blue-500"
                    : "border-gray-300 text-gray-500 bg-transparent hover:border-blue-500 hover:text-blue-500"
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
              className="text-3xl hover:text-blue-500 transition duration-200"
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
              <div key={cinema.id} className="bg-white p-6 shadow-md border border-gray-200">

                {/* ✅ แสดงแยกเป็นแต่ละหนัง */}
                {movieIds.map(movieId => {
                  const movieShowtimes = filteredShowtimes.filter(s => s.movie.id === movieId);
                  const firstShowtime = movieShowtimes.length > 0 ? movieShowtimes[0] : null;
                  const posterPath = firstShowtime ? moviePosters[movieId] : null;

                  return (
                    <div key={movieId} className="border-gray-300 ">
                      <div className="flex flex-col md:flex-row gap-4">
                        
                        {/* ✅ โปสเตอร์หนัง */}
                        {posterPath && (
                          <div className="w-full md:w-1/4">
                            <img
                              src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                              alt={firstShowtime?.movie.title || "Movie Poster"}
                              className="w-full h-auto object-cover rounded-lg"
                            />
                          </div>
                        )}

                        {/* ✅ รายละเอียดหนังและรอบฉาย */}
                        <div className="flex-1">
                          {firstShowtime && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-700 mb-1">
                                <strong>{cinema.name}</strong>
                              </p>
                              <p className="text-sm text-gray-700 mb-1">
                                <strong>Movie:</strong> {firstShowtime.movie.title}
                              </p>
                              <p className="text-sm text-gray-700">
                                <strong>Duration:</strong> {firstShowtime.movie.duration} mins
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-1 gap-4 mt-2">
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4 items-start">
                              
                              {/* ✅ ประเภทโรงภาพยนตร์ */}
                              <div className="flex flex-col md:justify-center border-r border-gray-300 pr-4 h-full">
                                <p className="text-gray-700 font-bold text-lg">{cinema.type}</p>
                                <div className="flex items-center gap-2 mt-2 md:mt-0">
                                  <FaVolumeUp className="text-gray-600" />
                                  <span className="text-sm">ENG</span>
                                  <span className="border px-1 text-xs">SUB</span>
                                </div>
                              </div>

                              {/* ✅ ปุ่มเลือกเวลา */}
                              <div className="flex gap-3 flex-wrap md:gap-4 w-full">
                                
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
                                      <button
                                        key={uniqueKey}
                                        className={`px-5 py-2 rounded-md border transition-all text-lg font-medium
                                          px-3 py-0.5 text-[12px] 
                                          sm:px-6 sm:py-2 sm:text-[15px] 
                                          md:px-8 md:py-2 md:text-[18px] ${
                                          isPast
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed" // ❌ เวลาที่หมดแล้ว
                                            : isNearest
                                            ? "bg-gradient-to-r from-blue-500 to-blue-300 text-white" // ✅ ปุ่มที่ใกล้ที่สุด 
                                            : selectedTime === showtime.time
                                            ? "border-blue-500 text-blue-500 bg-blue-100" // ✅ ปุ่มที่ถูกเลือก แต่ไม่ใช่ nearest
                                            : "border-blue-500 text-blue-500 hover:bg-blue-100" // 🟡 ปุ่มปกติที่ hover ได้
                                        }`}
                                        onClick={() => !isPast && setSelectedTime(showtime.time)} // ❌ ปิดคลิกปุ่มที่หมดเวลา
                                        disabled={isPast} // ❌ ปิดการกดปุ่มที่หมดเวลาแล้ว
                                      >
                                        {formattedTime}
                                      </button>
                                    );
                                  });
                                })()}
                              </div>
                            </div>
                          </div>
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
