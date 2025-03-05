"use client";

import React, { useEffect, useState } from "react";
import { Location } from "@/lib/types/booking";
import api from "@/lib/axios";
import Link from "next/link";
import LoadTwo from "@/app/components/ui/loading/loadTwo";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi"; 

const AddLocation = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State สำหรับ Popup Add/Edit
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [locationName, setLocationName] = useState("");
    const [locationAddress, setLocationAddress] = useState("");
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);

    // State สำหรับ Popup Confirm Delete
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);

    // ✅ ดึงข้อมูล Location จาก API
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                setIsLoading(true);
                const response = await api.get("/location");
                setLocations(response.data);
            } catch (err) {
                setError("An error occurred while fetching locations.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchLocations();
    }, []);

    // ✅ ฟังก์ชันเพิ่มหรืออัปเดต Location
    const handleCreateOrUpdateLocation = async () => {
        if (!locationName || !locationAddress) {
            setError("Please enter name and address.");
            return;
        }

        try {
            if (editingLocation) {
                // **อัปเดต Location**
                const response = await api.put("/location", {
                    id: editingLocation.id,
                    name: locationName,
                    address: locationAddress,
                });

                setLocations(locations.map(loc => (loc.id === editingLocation.id ? response.data : loc)));
            } else {
                // **เพิ่ม Location ใหม่**
                const response = await api.post("/location", {
                    name: locationName,
                    address: locationAddress,
                });

                setLocations([...locations, response.data]);
            }

            // รีเซ็ตค่าและปิด Popup
            setIsPopupOpen(false);
            setLocationName("");
            setLocationAddress("");
            setEditingLocation(null);
        } catch (err) {
            setError("Error creating/updating location.");
        }
    };

    // ✅ ฟังก์ชันแก้ไข Location
    const handleEditLocation = (location: Location) => {
        setEditingLocation(location);
        setLocationName(location.name);
        setLocationAddress(location.address);
        setIsPopupOpen(true);
    };

    // ✅ ฟังก์ชันลบ Location (เปิด Popup)
    const confirmDeleteLocation = (location: Location) => {
        setLocationToDelete(location);
        setIsDeletePopupOpen(true);
    };

    // ✅ ฟังก์ชันลบ Location (หลังจากกดยืนยัน)
    const handleDeleteLocation = async () => {
        if (!locationToDelete) return;

        try {
            await api.delete("/location", { data: { id: locationToDelete.id } });
            setLocations(locations.filter(loc => loc.id !== locationToDelete.id));
            setIsDeletePopupOpen(false);
            setLocationToDelete(null);
        } catch (err) {
            setError("Error deleting location.");
        }
    };

    if (isLoading) {
        return <LoadTwo />;
    }

    return (
        <div>
            <div className="container mx-auto max-w-5xl p-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-300">
                <h2 className="text-2xl font-semibold text-gray-800">Manage Locations</h2>
                <button
                        onClick={() => {
                            setEditingLocation(null);
                            setLocationName("");
                            setLocationAddress("");
                            setIsPopupOpen(true);
                        }}
                        className="bg-amber-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-amber-600 transition-all flex items-center gap-2"
                        >
                        <FiPlus /> Add Location
                    </button>
                </div>

                <div className="flex flex-col space-y-3 mt-4">
                    {locations.map((location) => (
                        <div
                            key={location.id}
                            className="bg-white p-4 border border-gray-300 rounded-3xl flex justify-between items-center shadow-md hover:shadow-lg transition-all"
                            >
                            <Link href={`/admin/cinema/${location.id}`} className="flex-grow">
                                <h2 className="text-black text-sm font-bold mb-2">{location.name}</h2>
                                <p className="text-gray-600 text-sm max-sm:text-xs">{location.address}</p>
                            </Link>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => handleEditLocation(location)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <FiEdit size={18} />
                                </button>
                                <button
                                    onClick={() => confirmDeleteLocation(location)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ✅ Popup สำหรับเพิ่ม/แก้ไข Location */}
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">{editingLocation ? "Edit Location" : "Add Location"}</h2>

                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                            className="w-full p-2 border rounded-lg mt-1"
                        />

                        <label className="block text-sm font-medium text-gray-700 mt-3">Address</label>
                        <input
                            type="text"
                            value={locationAddress}
                            onChange={(e) => setLocationAddress(e.target.value)}
                            className="w-full p-2 border rounded-lg mt-1"
                        />

                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                onClick={() => setIsPopupOpen(false)}
                                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateOrUpdateLocation}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                {editingLocation ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Popup ยืนยันการลบ Location */}
            {isDeletePopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                        <h2 className="text-lg font-bold mb-4 text-red-600">Confirm Delete</h2>
                        <p className="text-gray-700">Are you sure you want to delete <strong>{locationToDelete?.name}</strong>?</p>
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

export default AddLocation;