import { useState, useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import api from "@/lib/axios"; // Ensure correct API import
import { Movie, MovieResponse, MovieDetail } from "@/lib/types/movie";

interface AddShowtimeProps {
  isPopupOpen: boolean;
  setIsPopupOpen: Dispatch<SetStateAction<boolean>>;
  cinemaId: string; 
}

const CreateShowtime: React.FC<AddShowtimeProps> = ({ isPopupOpen, setIsPopupOpen }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const showtimeOptions = ["14:00", "17:00", "20:00"];

  // ✅ Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // ✅ Fetch movies when modal opens
  useEffect(() => {
    if (isPopupOpen) {
      const fetchMovies = async () => {
        try {
          const response = await api.get<MovieResponse>("/movies/nowplaying");
          if (Array.isArray(response.data.results)) {
            setMovies(response.data.results);
          } else {
            setMovies([]);
          }
        } catch (error) {
          console.error("❌ Error fetching movies:", error);
          setMovies([]);
        }
      };
      fetchMovies();
    }
  }, [isPopupOpen]);

  // ✅ Fetch selected movie details
  const handleMovieChange = async (movieId: string) => {
    setSelectedMovieId(movieId);
    setSelectedMovie(null);
    setStartDate("");
    setEndDate("");
    setSelectedTimes([]);

    if (!movieId) return;

    try {
      const response = await api.get<MovieDetail>(`/movies/${movieId}`);
      setSelectedMovie(response.data);
    } catch (error) {
      console.error("❌ Error fetching movie details:", error);
      setSelectedMovie(null);
    }
  };

  // ✅ Handle time selection (toggle selection)
  const handleTimeSelection = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  // ✅ Handle form submission & API POST request
  const handleCreateShowtime = async () => {
    if (!selectedMovieId || !startDate || !endDate || selectedTimes.length === 0) {
      alert("⚠️ Please select a movie, start date, end date, and at least one time slot!");
      return;
    }

    const showtimeData = {
      movieId: selectedMovieId,
      subCinemaId: id,
      startDate,
      endDate,
      times: selectedTimes, // Send array of selected times
    };

    try {
      setIsLoading(true);
      const response = await api.post("/showtime", showtimeData);
      console.log("✅ Showtime created successfully:", response.data);

      alert("🎉 Showtime added successfully!");
      setIsPopupOpen(false);
    } catch (error) {
      console.error("❌ Error creating showtime:", error);
      alert("❌ Failed to create showtime. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    isPopupOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[650px]">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-5">Add Showtime</h2>

          {/* ✅ Movie Selection */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700">Select Movie</label>
            <select
              className="w-full p-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
              value={selectedMovieId}
              onChange={(e) => handleMovieChange(e.target.value)}
            >
              <option value="">-- Select a Movie --</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id.toString()}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Show Movie Details */}
          {selectedMovie && (
            <div className="flex gap-4 bg-gray-100 p-3 rounded-lg mb-5">
              <img
                src={`https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`}
                alt={selectedMovie.title}
                className="w-24 h-auto rounded-lg shadow-md"
              />
              <div>
                <h3 className="text-md font-semibold">{selectedMovie.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedMovie.overview}</p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Duration:</strong> {selectedMovie.runtime ? `${selectedMovie.runtime} min` : "N/A"}
                </p>
              </div>
            </div>
          )}

          {/* ✅ Date Range Selection */}
          {selectedMovie && (
            <div>
              {/* ✅ Start Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                  value={startDate}
                  min={today}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {/* ✅ End Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                  value={endDate}
                  min={startDate || today}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={!startDate}
                />
              </div>

              {/* ✅ Time Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Select Showtime</label>
                <div className="flex gap-2 mt-2">
                  {showtimeOptions.map((time) => (
                    <button
                      key={time}
                      className={`px-4 py-2 rounded-lg border transition duration-200 ${
                        selectedTimes.includes(time)
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      onClick={() => handleTimeSelection(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ✅ Buttons */}
          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={() => setIsPopupOpen(false)}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition duration-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateShowtime}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CreateShowtime;