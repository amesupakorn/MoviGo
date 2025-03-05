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
import { FaCheck } from "react-icons/fa6";
import Link from "next/link";
import { useAuth } from "@/app/context/setLogged"

const CinemaSeatBooking = () => {
  const { id } = useParams();
  const router = useRouter();

  const {isLoggedIn} = useAuth();

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

    if(!isLoggedIn){
      router.push("/client/auth/login")
      setError("Please Login")
      setIsLoading(false);
      return

    }
    const showtimeId = id;  
    const status = "reserved";

    try {
        const res_booking = await api.post('/booking', {
          showtimeId,     
          selectedSeats,  
          status,          
        });

       if(res_booking.data){       
            await api.get(`/cookie/${res_booking.data.session}`);

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

    <>

    <div className="min-h-screen bg-white justify-center items-center">

        <div className="bg-white max-w-full  p-2 md:p-1 ">
          <div className="flex justify-center items-center gap-2 mb-10 mt-10 md:mt-8">
            <div className="flex-col justify-center items-center text-center gap-3">
              <div className="w-10 h-10 md:w-12 mx-10 mb-4">
                <SeatStandard />
              </div>
              <span className="text-base text-black">Standard</span>
              <p className="text-xs md:text-sm text-gray-700">320 THB</p>
            </div>
            <div className="flex-col text-sm md:text-xl justify-center items-center text-center gap-3">
              <div className="w-10 h-10 md:w-12 mx-10 mb-4">
                <SeatPremium />
              </div>
              <span className="text-base text-black">Premium</span>
              <p className="text-xs md:text-sm text-gray-700">350 THB</p>
            </div>
          </div>


          <div className="w-full flex justify-center p-4">
            <div className="w-full md:w-3/4 flex gap-8">
              <div className={`flex flex-col w-full ${isSmallScreenTwo ? 'w-[530px]' : ''}`}>
                <div className="relative justify-center mb-6 text-center">
                  <img
                    alt="screen"
                    src="/uploads/screen.svg"
                    className="md:w-full md:h-24 mx-auto" />
                  <span className="absolute top-6 left-1/2 transform -translate-x-1/2 text-black font-semibold text-sm sm:text-base">
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
                          <td className="text-gray-700 font-medium text-center w-10">{row}</td>

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
                                        <VscAccount className="text-gray-600 md:h-12 md:w-10 h-5 w-5 mx-1" />
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
                          <td className="text-gray-700 font-medium text-center w-10">{row}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Panel for Desktop */}
              {!isSmallScreenOne && (
                 <div className={`w-1/4 bg-white p-6 border border-gray-300 p-2 rounded-lg shadow-md h-[400px]`}>
                   <img
                      src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
                      alt="Movie Poster"
                      className=" object-cover rounded-lg" />

                  <div className="p-2 ">
                    <h3 className="text-sm font-bold text-gray-700">{movie?.title}</h3>
                    <p className="text-sm text-amber-500 mt-2">{formattedDate} {show?.time}</p>
                  <div className="text-md mt-2 text-gray-700">{cinema?.name}</div>
                  <div className="flex">

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">
                        <LuAudioLines />
                      </span>
                      <span className="text-sm text-gray-700">ENG</span>
                    </div>

                    <div className="border-l border-gray-400 h-6 mx-2"></div>

                    <div className="flex items-center gap-2 ">
                      <span className="font-semibold text-gray-700">
                        <PiSubtitles />
                      </span>
                      <span className="text-sm text-gray-700">TH</span>
                    </div>
                  </div>
                  </div>

                 
                </div>
              )}
            </div>
          </div>
        </div>


      </div></>
  );
};

export default CinemaSeatBooking;