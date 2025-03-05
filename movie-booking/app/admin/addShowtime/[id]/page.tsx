"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";
import { Cinema, Showtime } from "@/lib/types/booking";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi"; 
import Link from "next/link";

const AddShowtime = () => {
    const { id: cinemaId } = useParams(); 
    const [cinema, setCinema] = useState<Cinema | null>(null);

    // ✅ ดึงข้อมูลโรงหนังของ Cinema ที่เลือก
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

    return (
        <div className="container mx-auto max-w-5xl p-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold">Manage {cinema?.name ? cinema.name : ""}</span>
                    <div className="h-5 w-px bg-gray-500"></div>
                    <span className="text-xl">{cinema?.type ? cinema.type : ""}</span>
                </div>
                
                <button
                    className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 flex items-center gap-2"
                >
                    <FiPlus /> Add Showtime
                </button>
            </div>

            {/* ✅ แสดงรายการรอบฉายของหนัง */}
            <ul className="flex flex-col space-y-3 mt-4">
                {cinema?.showtimes.length ? (
                    cinema.showtimes.map((showtime: Showtime) => (
                        <div
                            key={showtime.id}
                            className="bg-white p-6 border border-gray-300 rounded-3xl flex justify-between items-center cursor-pointer hover:bg-gray-100"
                        >
                            <div className="flex-grow">
                                <h3 className="text-black text-sm font-bold mb-2">{showtime.movie.title}</h3>
                                <span className="text-gray-600 text-sm max-sm:text-xs">
                                    Duration: {showtime.movie.duration} min
                                </span>
                                <span className="text-gray-500 text-sm">Date: {new Date(showtime.date).toLocaleDateString()}</span>
                                <span className="text-gray-500 text-sm">Time: {showtime.time}</span>
                            </div>

                            <div className="flex space-x-3">
                                <button className="text-blue-600 hover:text-blue-800">
                                    <FiEdit size={18} />
                                </button>
                                <button className="text-red-600 hover:text-red-800">
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center mt-6">No showtimes available</p>
                )}
            </ul>
        </div>
    );
};

export default AddShowtime;