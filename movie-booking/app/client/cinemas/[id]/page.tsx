"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Location } from "@/lib/types/booking";
import { useParams } from "next/navigation";
import LoadTwo from "@/app/components/ui/loading/loadTwo";
import dayjs from "dayjs";
import { FaCaretRight,FaCaretLeft, FaVolumeUp } from "react-icons/fa";

const LocationDetailPage = () => {
  const { id } = useParams();
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // วันที่ปัจจุบัน
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today);
  const [startIndex, setStartIndex] = useState(0); // ตำแหน่งเริ่มต้นของวันที่แสดง
  const [selectedTime, setSelectedTime] = useState("15:00");

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
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  isSelected ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setSelectedDate(date)}
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


        {/* รายการโรงภาพยนตร์ */}
<div className="grid grid-cols-1 gap-6">
  {location?.subCinemas
    .filter(cinema => 
      cinema.showtimes.some(showtime => 
        dayjs(showtime.date).isSame(selectedDate, "day")
      )
    ) // ✅ กรองเฉพาะโรงที่มีรอบฉาย
    .map((cinema) => {
      // ✅ ดึงเฉพาะ `showtimes` ของวันที่เลือก
      const filteredShowtimes = cinema.showtimes.filter(showtime => 
        dayjs(showtime.date).isSame(selectedDate, "day")
      );

      const firstShowtime = filteredShowtimes.length > 0 ? filteredShowtimes[0] : null;

      return (
        <div key={cinema.id} className="bg-white p-6 shadow-md border border-gray-200">
          <h2 className="text-xl font-bold mb-2">{cinema.name}</h2>

          {firstShowtime && (
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-1">
                <strong>Movie:</strong> {firstShowtime.movie.title}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Duration:</strong> {firstShowtime.movie.duration} mins
              </p>
            </div>
          )}
          
          {/* border-t border-gray-300*/}
          <div className="grid grid-cols-1 gap-4 mt-2">
            <div className="grid grid-cols-[1fr_3fr] gap-4 items-start">
              <div className="flex flex-col justify-center border-r border-gray-300 pr-4 h-full">
                <p className="text-gray-700 font-bold text-lg">{cinema.type}</p>
              </div>

              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <FaVolumeUp className="text-gray-600" />
                  <span className="text-sm">ENG</span>
                  <span className="border px-1 text-xs">SUB</span>
                </div>

                <div className="flex gap-3 flex-wrap">
                {filteredShowtimes.map((showtime) => {
                  const formattedTime = dayjs(showtime.time, "HH:mm:ss").isValid()
                    ? dayjs(showtime.time, "HH:mm:ss").format("HH:mm")
                    : showtime.time.split(":").slice(0, 2).join(":");

                  return (
                    <button
                      key={showtime.id}
                      className={`px-5 py-2 rounded-md border transition-all text-lg font-medium ${
                        selectedTime === showtime.time
                          ? "bg-gradient-to-r from-blue-500 to-blue-300 text-white"
                          : "border-blue-500 text-blue-500 hover:bg-blue-100"
                      }`}
                      onClick={() => setSelectedTime(showtime.time)}
                    >
                      {formattedTime}
                    </button>
                  );
                })}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    })}
</div>

{/* border-t border-gray-300*/}
      </div>
      
      <div className="w-full max-w-4xl mx-auto space-y-6">
      
      


      <div className="border-t border-gray-300 py-4">
        <div className="grid grid-cols-[1fr_3fr] gap-4 items-start">
          {/* ฝั่งซ้าย: ภาษา & ชื่อโรงหนัง */}
          <div className="flex flex-col justify-center border-r border-gray-300 pr-4 h-full">
            <p className="text-gray-700 font-bold text-lg">Digital Cinema</p>
          </div>

          <div className="flex flex-col items-start gap-2">
            {/* 🔹 แถวบน: แสดงภาษา */}
            <div className="flex items-center gap-2">
              <FaVolumeUp className="text-gray-600" />
              <span className="text-sm">ENG</span>
              <span className="border px-1 text-xs">SUB</span>
            </div>

            {/* 🔹 แถวล่าง: ปุ่มเลือกเวลา */}
            <div className="flex gap-3 flex-wrap">
              {["10:20", "13:00", "15:40", "18:20", "21:00"].map((time, index) => {
                const isDisabled = index < 2; // จำลองว่ารอบ 10:20 และ 13:00 เต็มแล้ว
                return (
                  <button
                    key={time}
                    className={`px-5 py-2 rounded-md border transition-all text-lg font-medium ${
                      isDisabled
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : selectedTime === time
                        ? "bg-gradient-to-r from-blue-500 to-blue-300 text-white"
                        : "border-blue-500 text-blue-500 hover:bg-blue-100"
                    }`}
                    onClick={() => !isDisabled && setSelectedTime(time)}
                    disabled={isDisabled}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

    </div>
    </div>
  );
};

export default LocationDetailPage;
