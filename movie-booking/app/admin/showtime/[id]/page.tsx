"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { Cinema, Showtime } from "@/lib/types/booking";
import { FiTrash2, FiPlus, FiSearch } from "react-icons/fi"; 
import AddShowtime from "@/app/components/admin/manageData/addShowtime";
import { useAlert } from "@/app/context/AlertContext";

const ShowTimeView = () => {
    const { id: cinemaId } = useParams(); 
    const [cinema, setCinema] = useState<Cinema | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const { setError, setSuccess } = useAlert();   

    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [showtimeToDelete, setShowtimeToDelete] = useState<Showtime | null>(null);
    const [searchTerm, setSearchTerm] = useState(""); // 🔎 Search term state

    //  Confirm Delete Showtime
    const confirmDeleteShowtime = (showtime: Showtime) => {
        setShowtimeToDelete(showtime);
        setIsDeletePopupOpen(true);
    };

    //  Handle Showtime Deletion
    const handleDeleteShowtime = async () => {
        if (!showtimeToDelete) return;
    
        try {
            await api.delete(`/showtime`, { data: { id: showtimeToDelete.id } });

            //  Remove from state instantly
            setCinema((prevCinema) => {
                if (!prevCinema) return prevCinema;
                return {
                    ...prevCinema,
                    showtimes: prevCinema.showtimes.filter((show) => show.id !== showtimeToDelete.id),
                };
            });

            setSuccess("Showtime deleted successfully!");
            setIsDeletePopupOpen(false); 
            setShowtimeToDelete(null); 
        } catch (err) {
            setError("Error deleting showtime.");
            console.error("❌ Error deleting showtime:", err);
        }
    };

    //  Fetch Cinema Data
    useEffect(() => {
        const fetchCinemaData = async () => {
            try {
                const response = await api.get(`/cinema/${cinemaId}`);
                setCinema(response.data);
            } catch (error) {
                console.error("Error fetching cinema:", error);
            }
        };
        if (cinemaId) fetchCinemaData();
    }, [cinemaId]);

    //  Filter Showtimes Based on Search Term
    const filteredShowtimes = cinema?.showtimes.filter((showtime) =>
        showtime.movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto max-w-6xl p-6">
            {/* 📍 Header Section */}
            <div className="flex justify-between items-center border-b border-gray-300 pb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Manage Showtimes: <span className="text-amber-600">{cinema?.name}</span>
                </h2>
                
                <button
                    onClick={() => setIsPopupOpen(true)}
                    className="bg-amber-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-amber-600 transition-all flex items-center gap-2"
                >
                    <FiPlus size={18} /> Add Showtime
                </button>
            </div>

            {/* 🔎 Search Bar */}
            <div className="mt-4 flex items-center bg-white border rounded-lg p-2 shadow-md">
                <FiSearch className="text-gray-500 mx-2" size={18} />
                <input
                    type="text"
                    placeholder="Search by movie title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full outline-none text-gray-700"
                />
            </div>

            {/* 🎟️ Showtime List */}
            <div className="mt-6 space-y-4">
                {filteredShowtimes?.length ? (
                    filteredShowtimes.map((showtime: Showtime) => (
                        <div
                            key={showtime.id}
                            className="bg-white p-4 border border-gray-300 rounded-3xl flex items-center shadow-md hover:shadow-lg transition-all"
                        >
                            {/* 🎬 Movie Title (Left-Aligned) */}
                            <span className="text-gray-900 font-semibold w-1/3">
                                {showtime.movie.title}
                            </span>

                            {/* 📅 Other Details (Right-Aligned) */}
                            <div className="flex items-center justify-end w-2/3 space-x-4">
                                <span className="bg-blue-100 text-blue-900 px-3 py-1 text-sm font-medium rounded-2xl">
                                    🎬 {showtime.movie.duration} min
                                </span>
                                <span className="bg-green-100 text-green-900 px-3 py-1 text-sm font-medium rounded-2xl">
                                    📅 {new Date(showtime.date).toLocaleDateString()}
                                </span>
                                <span className="bg-purple-100 text-purple-900 px-3 py-1 text-sm font-medium rounded-2xl">
                                    ⏰ {showtime.time}
                                </span>

                                {/* ❌ Delete Button */}
                                <button 
                                    onClick={() => confirmDeleteShowtime(showtime)}
                                    className="text-red-500 hover:text-red-700 transition-all"
                                >
                                    <FiTrash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center mt-6">No showtimes available</p>
                )}
            </div>

            {/* 🆕 Add Showtime Modal */}
            {isPopupOpen && (
                <AddShowtime 
                    isPopupOpen={isPopupOpen} 
                    setIsPopupOpen={setIsPopupOpen} 
                    cinemaId={cinemaId} 
                    setCinema={setCinema} 
                />
            )}

            {/* ❌ Delete Confirmation Modal */}
            {isDeletePopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                        <h2 className="text-lg font-bold mb-4 text-red-600">Confirm Deletion</h2>
                        <p className="text-gray-700">
                            Are you sure you want to delete <strong className="text-gray-900">{showtimeToDelete?.movie.title}</strong> showtime?
                        </p>
                        <div className="flex justify-center mt-4 space-x-4">
                            <button
                                onClick={() => setIsDeletePopupOpen(false)}
                                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteShowtime}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}; 

export default ShowTimeView;