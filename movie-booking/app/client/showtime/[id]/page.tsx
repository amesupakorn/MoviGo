"use client";
import React, { useEffect, useState } from "react";
import SeatStandard from "@/app/components/ui/seat/standard";
import SeatPremium from "@/app/components/ui/seat/premium";
import { useParams } from "next/navigation";
import { Showtime, Cinema, Seat } from "@/lib/types/booking";
import api from "@/lib/axios";
import LoadTwo from "@/app/components/ui/loading/loadTwo";
import { Movie } from "@/lib/types/movie";
import { LuAudioLines } from "react-icons/lu";
import { PiSubtitles } from "react-icons/pi";
import { FaCircleCheck } from "react-icons/fa6";
import { useAlert } from "@/app/context/AlertContext";
import { VscAccount } from "react-icons/vsc";
import Loading from "@/app/components/ui/loading/loadOne";
import { useRouter } from "next/navigation";


const CinemaSeatBooking = () => {
  const { id } = useParams();
  const router = useRouter();

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]); 
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  const [show, setShowtime] = useState<Showtime | null>(null);
  const [seatReserve, setSeat] = useState<Seat[]>([]);  // An array of seats
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cinema, setCinema] = useState<Cinema | null>(null);

  const [isSmallScreenOne, setIsSmallScreenOne] = useState(false);
  const [isSmallScreenTwo, setIsSmallScreenTwo] = useState(false);

  const { setError, setSuccess } = useAlert();   
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const handleResize = () => {
        const width = window.innerWidth;

        setIsSmallScreenOne(width < 1200);

        setIsSmallScreenTwo(width >= 1200 && width < 1200);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
        window.removeEventListener("resize", handleResize);
    };
  }, []);


  useEffect(() => {
    const fetchShowtime = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/showtime/${id}`);
        setShowtime(response.data);

        const cinemaResponse = await api.get(`/cinema/${response.data.subCinemaId}`);
        const movieResponse = await api.get(`/movies/${response.data.movieId}`);
        const seatResponse = await api.get(`/seats/${id}`);

        if(cinemaResponse){
          setCinema(cinemaResponse.data);
        }
        if(movieResponse){
          setMovie(movieResponse.data);
        }
        if(seatResponse.data){
          setSeat(seatResponse.data);
        }

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



  const rows = ["L", "K", "J", "H", "G", "F", "E", "D", "C", "B", "A"];
  const seatsPerRow = 12;
  const premiumRows = ["A", "B", "C", "D", "E", "F"];

  // Handle seat selection
  const handleSelectSeat = (row: string, seatIndex: number) => {
    const seatIdentifier = `${row}${seatIndex + 1}`;
    if (selectedSeats.includes(seatIdentifier)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatIdentifier)); // Deselect seat
    } else {
      setSelectedSeats([...selectedSeats, seatIdentifier]); // Select seat
    }
  };

  const seatPrice = (seat: string) => {
    const row = seat.charAt(0); 
    return premiumRows.includes(row) ? 350 : 320; 
  };

  const totalPrice = selectedSeats.reduce(
    (total, seat) => total + seatPrice(seat),
    0
  );

  const isReserved = (row: string, seatIndex: number) => {
    const seatIdentifier = `${row}${seatIndex + 1}`;
    if (!Array.isArray(seatReserve)) {
      return false; 
    }
    return seatReserve.some(seat => `${seat.row}${seat.number}` === seatIdentifier && !seat.isAvailable);

  };


  const handleSubmitBooking = async () => {
    setIsLoading(true);
    const showtimeId = id;  
    const status = "reserved";

    try {
        const res_booking = await api.post('/booking', {
          showtimeId,     
          selectedSeats,  
          status,          
        });

  
       if(res_booking.data.url){       
            router.push(res_booking.data.url);
            setIsLoading(false);
       }
  
  
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError('Something went wrong. Please try again.');
    }
  };



  if (loading) return <LoadTwo />;

  return (
    <div className="min-h-screen bg-gray-100 justify-center items-center">
      {/* showtime detail */}
      <div className="w-full flex justify-center items-center mb-3">
        <div className="w-[1000px] p-6 bg-white rounded-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-48 h-auto">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
                alt="Movie Poster"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {movie?.title}
              </h2>
              <p className="text-base text-blue-600 mt-2">
                {formattedDate} | {show?.time}
              </p>

              <div className="flex items-center gap-2 mt-4 text-sm md:text-base">
                <div className="text-lg text-gray-700">{cinema?.name}</div>
                <div className="border-l border-gray-400 h-6 mx-2 "></div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    <LuAudioLines />
                  </span>
                  <span className="text-gray-700">ENG</span>
                </div>

                <div className="border-l border-gray-400 h-6 mx-2"></div>

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

     
      <div className="bg-white max-w-full mt-12 p-2 md:p-1 ">
      <div className="flex justify-center items-center gap-2 mb-10 mt-10 md:mt-8">
        <div className="flex-col justify-center items-center text-center gap-3">
          <div className="w-10 h-10 md:w-12 mx-10 mb-4">
            <SeatStandard />
          </div>
          <span className="text-base text-gray-700">Standard</span>
          <p className="text-xs md:text-sm">320 THB</p>
        </div>
        <div className="flex-col text-sm md:text-xl justify-center items-center text-center gap-3">
          <div className="w-10 h-10 md:w-12 mx-10 mb-4">
            <SeatPremium />
          </div>
          <span className="text-base text-gray-700">Premium</span>
          <p className="text-xs md:text-sm">350 THB</p>
        </div>
      </div>


        <div className="w-full flex justify-center p-4">
          <div className="w-full md:w-3/4 flex gap-8">
          <div className={`flex flex-col w-full ${isSmallScreenTwo ? 'w-[530px]' : ''}`}>
              <div className="relative justify-center mb-6 text-center">
                <img
                  alt="screen"
                  src="/uploads/screen.svg"
                  className="md:w-full md:h-24 mx-auto"
                />
                <span className="absolute top-6 left-1/2 transform -translate-x-1/2 text-gray-800 font-semibold text-sm sm:text-base">
                  SCREEN
                </span>
              </div>

              {/* Seat Selection */}
              <div className={`flex flex-col w-full overflow-x-auto  ${isSmallScreenOne ? 'px-0  h-[500px]' : 'px-12 h-[700px]'}`}>

              <table className="table-auto">
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row}>
                        {/* แสดงชื่อแถว */}
                        <td className="text-gray-600 font-medium text-center w-10">{row}</td>

                        {/* ที่นั่ง */}
                        <td className="w-full">
                          <div className="flex gap-1 justify-center">
                            {Array(seatsPerRow)
                              .fill(null)
                              .map((_, seatIndex) => {
                                const seatIdentifier = `${row}${seatIndex + 1}`;
                                const isSelected = selectedSeats.includes(seatIdentifier);
                                const reserved = isReserved(row, seatIndex);

                                return (
                                  <div
                                    key={seatIndex}
                                    onClick={() => !reserved && handleSelectSeat(row, seatIndex)}
                                    className="md:h-12 md:w-12 h-6 w-6 cursor-pointer"
                                  >
                                    {reserved ? (
                                      <VscAccount className="text-gray-400 md:h-12 md:w-10 h-5 w-5 mx-1" />
                                    ) : isSelected ? (
                                      <FaCircleCheck className="text-red-500 md:h-11 md:w-11 h-5 w-5" />
                                    ) : premiumRows.includes(row) ? (
                                      <SeatPremium />
                                    ) : (
                                      <SeatStandard />
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        </td>

                        {/* แสดงชื่อแถวอีกครั้ง */}
                        <td className="text-gray-600 font-medium text-center w-10">{row}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Panel for Desktop */}
            {!isSmallScreenOne && (
              <div className={`w-1/4 bg-gray-50 p-2 rounded-lg shadow-md h-[700px] ${isSmallScreenTwo ? '' : ''}`}>
                <div className="p-2 ">
                  <h3 className="text-xl font-bold text-gray-800">{movie?.title}</h3>
                  <p className="text-sm text-blue-600 mt-2">{formattedDate}</p>
                  <p className="text-sm text-blue-600">{show?.time}</p>
                </div>
                <div className="p-2 mt-4">
                  <h3 className="text-base font-bold text-gray-800 mb-12">CINEMA 12</h3>
                </div>

                <div className="bg-white rounded-xl p-4 w-full items-center text-center justify-cente mt-32 ">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Selected Seat</h3>
                  <div className="mb-2 text-blue-600 font-bold text-2xl">
                    {selectedSeats.length > 0 ? selectedSeats.join(", ") : "-"}
                  </div>

                  <h3 className="text-sm font-bold text-gray-800 mt-6 mb-2">Total</h3>
                  <div className="mb-6 text-blue-600 font-bold text-xl">
                    {selectedSeats.length > 0 ? `${totalPrice} THB` : "Please select seats"}
                  </div>

                  <button disabled={isLoading} onClick={handleSubmitBooking}
                   className={`w-full mb-2 rounded rounded-3xl flex justify-center items-center font-medium transition ${
                    isLoading ? "bg-gradient-to-r from-blue-200 to-blue-400 cursor-not-allowed " : "bg-gradient-to-r from-blue-600 to-blue-400 py-2 text-white hover:bg-gray-700"
                    }`}>
                    
                    {isLoading ? <Loading /> : "Continue"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Panel */}
      {isSmallScreenOne && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-400 p-2 border-t-2 border-gray-300">
          <div className="flex justify-between items-center">
            <div className="text-xs flex flex-col font-semibold">
              <p className="text-white mb-1">Selected Seat</p>
              <div className="mb-2 text-white font-bold text-sm">
                    {selectedSeats.length > 0 ? selectedSeats.join(", ") : "-"}
                  </div>
              </div>
            
            <div className="text-xs flex flex-col font-semibold text-right">
              <p className="text-white mb-1">total</p>
              <div className="mb-2 text-white font-bold text-sm">
                    {selectedSeats.length > 0 ? `${totalPrice} THB` : "O THB"}
                  </div>

            </div>
          </div>

          <div className="flex justify-between mt-2">
            <button  onClick={handleSubmitBooking} className="text-blue-500 w-full py-2 rounded-lg bg-white border-white border hover:bg-blue-500 hover:text-white">
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CinemaSeatBooking;