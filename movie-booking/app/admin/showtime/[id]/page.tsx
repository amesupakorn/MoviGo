"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";
import { Cinema, Showtime } from "@/lib/types/booking";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi"; 
import Link from "next/link";
import AddShowtime from "@/app/components/admin/manageData/addShowtime";

const ShowTimeView = () => {
    const { id: cinemaId } = useParams(); 
    const [cinema, setCinema] = useState<Cinema | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false); // ✅ Explicit boolean type
    const [error, setError] = useState<string | null>(null);

    // State สำหรับ Popup Add/Edit
    const [showtimeName, setShowtimeName] = useState("");
    const [showtimeAddress, setShowtimeAddress] = useState("");
    const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);

    // State สำหรับ Popup Confirm Delete
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [showtimeToDelete, setShowtimeToDelete] = useState<Showtime | null>(null);
    

    // State สำหรับ Popup Confirm Delete
    const handleCreateOrUpdateLocation = async () => {
        if (!showtimeName || !showtimeAddress) {
            setError("Please enter name and address.");
            return;
        }

        try {
            if (editingShowtime) {
                // **อัปเดต Location**
                // const response = await api.put("/location", {
                //     id: editingShowtime.id,
                //     name: showtimeName,
                //     address: showtimeAddress,
                // });

                // setLocations(locations.map(loc => (loc.id === editingLocation.id ? response.data : loc)));
            } else {
                // **เพิ่ม Location ใหม่**
                // const response = await api.post("/location", {
                //     name: locationName,
                //     address: locationAddress,
                // });

                // setLocations([...locations, response.data]);
            }

            // รีเซ็ตค่าและปิด Popup
            // setIsPopupOpen(false);
            // setLocationName("");
            // setLocationAddress("");
            // setEditingLocation(null);
        } catch (err) {
            setError("Error creating/updating location.");
        }
    };

    // ✅ ฟังก์ชันแก้ไข Location
    // const handleEditLocation = (location: Location) => {
    //     setEditingLocation(location);
    //     setLocationName(location.name);
    //     setLocationAddress(location.address);
    //     setIsPopupOpen(true);
    // };

    // ✅ ฟังก์ชันลบ Location (เปิด Popup)
    // const confirmDeleteLocation = (location: Location) => {
    //     setLocationToDelete(location);
    //     setIsDeletePopupOpen(true);
    // };

    // ✅ ฟังก์ชันลบ Location (หลังจากกดยืนยัน)
    // const handleDeleteLocation = async () => {
    //     if (!locationToDelete) return;

    //     try {
    //         await api.delete("/location", { data: { id: locationToDelete.id } });
    //         setLocations(locations.filter(loc => loc.id !== locationToDelete.id));
    //         setIsDeletePopupOpen(false);
    //         setLocationToDelete(null);
    //     } catch (err) {
    //         setError("Error deleting location.");
    //     }
    // };

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
                    onClick={() => {
   
                        setIsPopupOpen(true);
                    }}
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
                                <button 
                                    onClick={() => confirmDeleteShowtime(showtime)}
                                    className="text-red-600 hover:text-red-800">
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center mt-6">No showtimes available</p>
                )}
            </ul>



            {isPopupOpen && <AddShowtime isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} cinemaId={cinemaId} />}


            {isDeletePopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                        <h2 className="text-lg font-bold mb-4 text-red-600">Confirm Delete</h2>
                        <p className="text-gray-700">Are you sure you want to delete <strong>{}</strong>?</p>
                        <div className="flex justify-center mt-4 space-x-4">
                            <button
                                onClick={() => setIsDeletePopupOpen(false)}
                                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteLocation}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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