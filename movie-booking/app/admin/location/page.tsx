/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { Location } from "@/lib/types/booking";
import api from "@/lib/axios";
import Link from "next/link";
import LoadTwo from "@/app/components/ui/loading/loadTwo";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { MapPin, Plus, Trash2, Edit3, ChevronRight, X } from "lucide-react";
import { useAlert } from "@/app/context/AlertContext";

const AddLocation = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { setError, setSuccess } = useAlert();

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
            } catch {
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

                setSuccess("Location updated successfully");
                setLocations(locations.map(loc => (loc.id === editingLocation.id ? response.data : loc)));
            } else {
                // **เพิ่ม Location ใหม่**
                const response = await api.post("/location", {
                    name: locationName,
                    address: locationAddress,
                });
                setSuccess("New location added successfully");
                setLocations([...locations, response.data]);
            }

            // รีเซ็ตค่าและปิด Popup
            setIsPopupOpen(false);
            setLocationName("");
            setLocationAddress("");
            setEditingLocation(null);
        } catch {
            setError("Error processing request.");
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
            setSuccess("Location deleted successfully");
            setIsDeletePopupOpen(false);
            setLocationToDelete(null);
        } catch {
            setError("Error deleting location.");
        }
    };

    if (isLoading) {
        return <LoadTwo />;
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Location Management</h1>
                    <p className="text-slate-500 font-medium mt-1">Configure your cinema branches and their physical addresses.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingLocation(null);
                        setLocationName("");
                        setLocationAddress("");
                        setIsPopupOpen(true);
                    }}
                    className="px-6 py-3.5 bg-amber-500 text-white rounded-2xl font-bold text-sm hover:bg-amber-600 transition-all flex items-center shadow-lg shadow-amber-500/20 active:scale-95"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add Location
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {locations.map((location) => (
                    <div
                        key={location.id}
                        className="group bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
                    >
                        <Link href={`/admin/cinema/${location.id}`} className="flex items-center space-x-5 flex-grow">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-amber-500 group-hover:bg-amber-50 group-hover:border-amber-100 transition-all">
                                <MapPin className="w-7 h-7" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{location.name}</h2>
                                <p className="text-slate-500 text-sm font-medium">{location.address}</p>
                            </div>
                        </Link>
                        <div className="flex items-center space-x-2 mt-4 sm:mt-0 ml-auto sm:ml-0">
                            <button
                                onClick={() => handleEditLocation(location)}
                                className="p-3 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-200"
                                title="Edit Location"
                            >
                                <Edit3 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => confirmDeleteLocation(location)}
                                className="p-3 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200"
                                title="Delete Location"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                            <Link
                                href={`/admin/cinema/${location.id}`}
                                className="p-3 text-slate-400 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-xl transition-all duration-200"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {locations.length === 0 && (
                <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <MapPin className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No locations available</h3>
                    <p className="text-slate-500 mt-2 max-w-xs mx-auto">Create your first cinema branch location to start managing cinemas and showtimes.</p>
                </div>
            )}

            {/* ✅ Popup สำหรับเพิ่ม/แก้ไข Location */}
            {isPopupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100 transform animate-in zoom-in-95 duration-300 relative">
                        <button
                            onClick={() => setIsPopupOpen(false)}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                            {editingLocation ? <Edit3 className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 mb-2">
                            {editingLocation ? "Edit Location" : "Add New Location"}
                        </h2>
                        <p className="text-slate-500 text-sm font-medium mb-8">
                            {editingLocation ? "Update the information for this branch." : "Enter the details for your new cinema branch."}
                        </p>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Location Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. MoviGo Grand Siam"
                                    value={locationName}
                                    onChange={(e) => setLocationName(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Full Address</label>
                                <textarea
                                    rows={3}
                                    placeholder="e.g. 999 Rama I Rd, Pathum Wan, Bangkok 10330"
                                    value={locationAddress}
                                    onChange={(e) => setLocationAddress(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-10">
                            <button
                                onClick={() => setIsPopupOpen(false)}
                                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateOrUpdateLocation}
                                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
                            >
                                {editingLocation ? "Save Changes" : "Create Location"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Popup ยืนยันการลบ Location */}
            {isDeletePopupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-sm border border-slate-100 transform animate-in zoom-in-95 duration-300 text-center relative">
                        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Trash2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Delete Location?</h2>
                        <p className="text-slate-500 text-sm font-medium mb-8">
                            Are you sure you want to delete <span className="text-slate-900 font-bold">&quot;{locationToDelete?.name}&quot;</span>? This action cannot be undone.
                        </p>
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={handleDeleteLocation}
                                className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95"
                            >
                                Yes, Delete Forever
                            </button>
                            <button
                                onClick={() => setIsDeletePopupOpen(false)}
                                className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                            >
                                No, Keep It
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddLocation;
