"use client";
import React, { useEffect, useState } from "react";
import SeatStandard from "@/app/components/ui/seat/standard";
import SeatPremium from "@/app/components/ui/seat/premium";
import { useParams } from "next/navigation";
import { Showtime, Cinema } from "@/lib/types/booking";
import api from "@/lib/axios";
import LoadTwo from "@/app/components/ui/loading/loadTwo";
import { Movie } from "@/lib/types/movie";
import { LuAudioLines } from "react-icons/lu";
import { PiSubtitles } from "react-icons/pi";
import { FaCircleCheck } from "react-icons/fa6";


const CinemaSeatBooking = () => {
  const [leftSelected, setLeftSelected] = useState<string[]>([]);
  const [rightSelected, setRightSelected] = useState<string[]>([]);
  const { id } = useParams();
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const [show, setShowtime] = useState<Showtime | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cinema, setCinema] = useState<Cinema | null>(null);

  
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchShowtime = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/showtime/${id}`);
        setShowtime(response.data);

        const cinemaResponse = await api.get(`/cinema/${response.data.subCinemaId}`);
        const movieResponse = await api.get(`/movies/${response.data.movieId}`);

        setCinema(cinemaResponse.data);
        setMovie(movieResponse.data);

        // Date and Time formatting logic moved here
        const date = new Date(response.data.date); 
        const dateStr = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

        setFormattedDate(dateStr);

      } catch (err) {
        setError("Failed to fetch location details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtime();
  }, [id]);


  const rows = ["M", "L", "K", "J", "H", "G", "F", "E", "D", "C", "B", "A"]; // Reversed rows
  const seatsPerRow = 12;
  const premiumRows = ["A", "B", "C", "D", "E", "F"]; // Premium rows

  const handleSelectSeat = (row: string, seatIndex: number, isLeft: boolean) => {
    const selectedState = isLeft ? leftSelected : rightSelected;
    const setter = isLeft ? setLeftSelected : setRightSelected;

    const seatIdentifier = `${row}-${seatIndex}`;
    if (selectedState.includes(seatIdentifier)) {
      setter(selectedState.filter(seat => seat !== seatIdentifier)); // Deselect seat
    } else {
      setter([...selectedState, seatIdentifier]); // Select seat
    }
  };


  // สร้างการแสดงที่นั่งที่เลือก
  const selectedSeats = [...leftSelected, ...rightSelected].map(seatIdentifier => {
    const [row, number] = seatIdentifier.split('-');
    
    // ใช้เลขที่นั่งที่มีการต่อจากฝั่งซ้าย
    const seatNumber = parseInt(number); // ไม่ต้องบวกแค่ใช้หมายเลขที่คำนวณ
    return `${row}${seatNumber}`;
  });

  const seatPrice = (seat: string) => {
    const [row] = seat.split('-');
    return premiumRows.includes(row) ? 350 : 320; 
  };

  const totalPrice = selectedSeats.reduce((total, seat) => total + seatPrice(seat), 0);
    

  if (loading) return <LoadTwo/> ;
  if (error) return <div className="text-red-500">{error}</div>;


  return (
    
    <div className="min-h-screen bg-gray-100 p-2 justify-center items-center">


      {/* showtime detail */}
      <div className="w-full flex justify-center items-center  mb-3">
        <div className="w-[1000px] p-6 bg-white rounded-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Movie Poster */}
            <div className="w-48 h-auto">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
                alt="Movie Poster"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Movie Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {movie?.title}
              </h2>
              <p className="text-base text-blue-600 mt-2">{formattedDate} | {show?.time}</p>

              <div className="flex items-center gap-2 mt-4 text-sm md:text-base">
                {/* Cinema Name */}
                <div className="text-lg text-gray-700">{cinema?.name}</div>

                {/* Vertical Divider */}
                <div className="border-l border-gray-400 h-6 mx-2 "></div>

                {/* Audio */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    <LuAudioLines />
                  </span>
                  <span className="text-gray-700">ENG</span>
                </div>

                {/* Vertical Divider */}
                <div className="border-l border-gray-400 h-6 mx-2"></div>

                {/* Subtitles */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    <PiSubtitles />
                  </span>
                  <span className="text-gray-700">TH</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
     

      {/* Pricing Information */}

      <div className="bg-white max-w-full mt-10 p-2 md:p-12">
      <div className="flex justify-center items-center gap-2 mb-12 md:mt-2 mt-10">
        <div className="flex-col justify-center items-center text-center gap-3">
          <div className="w-10 h-10 md:w-10 md:w-10 mx-10 mb-2">
            <SeatStandard />
          </div>
          <span className="text-base text-gray-700">Standard</span>
          <p className="text-xs md:text-sm">320 THB</p>
        </div>
        <div className="flex-col text-sm md:text-xl justify-center items-center text-center gap-3">
          <div className="w-10 h-10 md:w-12 md:w-10 mx-10 mb-2">
            <SeatPremium />
          </div>
          <span className="text-base text-gray-700">Premium</span>
          <p className="text-xs md:text-sm">350 THB</p>
        </div>
      </div>

      {/* Seat Layout */}
      <div className="flex justify-between">
        <div className="w-full overflow-x-auto">
          {/* Screen */}
         <div className="justify-around w-[350px] md:w-full">
            <div className="relative justify-center mb-10 text-center ">
                <img
                alt="screen"
                src="/uploads/screen.svg"
                className="md:w-full md:h-24 h-12 mx-auto"
                />
                <span className="absolute top-6 left-1/2 transform -translate-x-1/2 text-gray-800 font-semibold text-sm sm:text-base">
                SCREEN
            </span>
            </div>
        </div>

        <div className="flex justify-around gap-4">
        <div className="md:w-20 space-y-2">
                {rows.map((row) => (
                  <div key={row} className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium w-6 text-center">{row}</span>
                    <div className="flex gap-1">
                      {Array(seatsPerRow / 2).fill(null).map((_, index) => {
                        const seatIdentifier = `${row}-${index}`;
                        const isSelected = leftSelected.includes(seatIdentifier);

                        return (
                          <div
                            key={index}
                            onClick={() => handleSelectSeat(row, index, true)}
                            className="md:h-8 md:w-8 h-6 w-6 cursor-pointer"
                            >
                            {isSelected && <FaCircleCheck className="text-red-500 md:h-8 md:w-8 h-5 w-5" />}
                            {!isSelected && (premiumRows.includes(row) ? <SeatPremium /> : <SeatStandard />)}
                        </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Section */}
            <div className="md:w-20 space-y-2">
              {rows.map((row) => (
              <div key={row} className="flex items-center gap-2 justify-end">
                <div className="flex gap-1">
                  {Array(seatsPerRow / 2).fill(null).map((_, index) => {
                    const seatIdentifier = `${row}-${index}`;
                    const isSelected = rightSelected.includes(seatIdentifier);

                    return (
                      <div
                        key={index}
                        onClick={() => handleSelectSeat(row, index, false)}
                        className="md:h-8 md:w-8 h-6 w-6 cursor-pointer"
                      >
                        {isSelected && <FaCircleCheck className="text-red-500 md:h-8 md:w-8 h-5 w-5" />}
                        
                        {/* Show seat only when not selected */}
                        {!isSelected && (premiumRows.includes(row) ? <SeatPremium /> : <SeatStandard />)}
                      </div>
                    );
                  })}
                </div>
                <span className="text-gray-600 font-medium w-6 text-center">{row}</span>
              </div>
            ))}
          </div>
      </div>
        </div>

        {/* Right Panel (for Desktop) */}
        <div className="w-1/4 bg-gray-50 p-2 rounded-lg shadow-md hidden md:block">
            <div className="p-2">
                <h3 className="text-base font-bold text-gray-800">Captain America : Brave New World</h3>
                <p className="text-sm text-blue-600">19 February 2025</p>
                <p className="text-sm text-blue-600">12:00</p>
            </div>
            <div className="p-2 mt-4">
                <h3 className="text-base font-bold text-gray-800">CINEMA 4</h3>
                <p className="text-sm text-blue-600">Emprive' Cineclub Emporium Sukhumvit</p>
            </div>


        
            <div className="bg-white rounded-xl p-4 w-full items-center text-center justify-center mt-36 ">
              <h3 className="text-sm font-bold text-gray-800">Selected Seat</h3>

              {/* แสดงที่นั่งที่เลือก */}
              <div className="mb-4">
                {selectedSeats.length > 0 ? (
                  selectedSeats.join(", ") // แสดงแถวและตัวเลขที่เลือก
                ) : (
                  <span className="text-gray-500">No seat selected</span>
                )}
              </div>

              <h3 className="text-sm font-bold text-gray-800 mt-16 mb-12">Total</h3>

              {/* แสดงราคาที่นั่งที่เลือก */}
              <div className="mb-4">
                {selectedSeats.length > 0 ? (
                  `${totalPrice} THB`
                ) : (
                  <span className="text-gray-500">Please select seats</span>
                )}
              </div>

              <button className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg">
                Continue
              </button>
            </div>
          
        </div>

        {/* Fixed Bottom Panel (for Mobile) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-lg border-t-2 border-gray-300 md:hidden">
          <div className="flex justify-between items-center">
            <div className="text-xl text-gray-800 font-semibold">Selected Seat</div>
            <div className="text-xl text-gray-700">0 THB</div>
          </div>
          <div className="flex justify-between mt-4">
            <button className="text-white bg-blue-500 w-full py-2 rounded-lg">
              Continue
            </button>
          </div>
        </div>
      </div>
      </div>
   
    </div>
  );
};

export default CinemaSeatBooking;