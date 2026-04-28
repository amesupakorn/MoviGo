"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { Cinema, Showtime } from "@/lib/types/booking";
import { MapPin, Plus, Trash2, Search, Info, Clock, Calendar as CalendarIcon, Film } from "lucide-react";
import AddShowtime from "@/app/components/admin/manageData/addShowtime";
import { useAlert } from "@/app/context/AlertContext";
import LoadTwo from "@/app/components/ui/loading/loadTwo";

const ShowTimeView = () => {
    const { id: cinemaId } = useParams();
    const [cinema, setCinema] = useState<Cinema | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const { setError, setSuccess } = useAlert();

    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [showtimeToDelete, setShowtimeToDelete] = useState<Showtime | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const confirmDeleteShowtime = (showtime: Showtime) => {
        setShowtimeToDelete(showtime);
        setIsDeletePopupOpen(true);
    };

    const handleDeleteShowtime = async () => {
        if (!showtimeToDelete) return;

        try {
            await api.delete(`/showtime`, { data: { id: showtimeToDelete.id } });

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
        } catch {
            setError("Error deleting showtime.");
        }
    };

    useEffect(() => {
        const fetchCinemaData = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/cinema/${cinemaId}`);
                setCinema(response.data);
            } catch {
                setError("Error fetching cinema data");
            } finally {
                setIsLoading(false);
            }
        };
        if (cinemaId) fetchCinemaData();
    }, [cinemaId, setError]);

    const filteredShowtimes = cinema?.showtimes.filter((showtime) =>
        showtime.movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <LoadTwo />;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <div className="flex items-center space-x-2 text-amber-600 mb-2 font-black uppercase tracking-widest text-[10px]">
                        <MapPin className="w-3 h-3" />
                        <span>{cinema?.name}</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Showtimes</h1>
                    <p className="text-slate-500 font-medium mt-1">Schedule and monitor movie screenings for this cinema.</p>
                </div>

                <button
                    onClick={() => setIsPopupOpen(true)}
                    className="px-6 py-3.5 bg-amber-500 text-white rounded-2xl font-bold text-sm hover:bg-amber-600 transition-all flex items-center shadow-lg shadow-amber-500/20 active:scale-95"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add Showtime
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Filter by movie title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all shadow-sm font-medium"
                />
            </div>

            {/* Showtime List */}
            <div className="space-y-4">
                {filteredShowtimes?.length ? (
                    filteredShowtimes.map((showtime: Showtime) => (
                        <div
                            key={showtime.id}
                            className="group bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
                        >
                            <div className="flex items-center space-x-5 flex-grow">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-amber-500 group-hover:bg-amber-50 group-hover:border-amber-100 transition-all">
                                    <Film className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{showtime.movie.title}</h3>
                                    <div className="flex items-center space-x-3 mt-1">
                                        <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {showtime.movie.duration} MIN
                                        </div>
                                        <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                        <div className="flex items-center text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                            <CalendarIcon className="w-3 h-3 mr-1" />
                                            {new Date(showtime.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 mt-4 sm:mt-0 ml-auto sm:ml-0">
                                <div className="px-5 py-2.5 bg-slate-900 text-amber-500 rounded-xl font-black text-sm border border-slate-800 shadow-lg shadow-slate-900/10">
                                    {showtime.time}
                                </div>
                                <button
                                    onClick={() => confirmDeleteShowtime(showtime)}
                                    className="p-3 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200"
                                    title="Delete Showtime"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Info className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No showtimes found</h3>
                        <p className="text-slate-500 mt-2 max-w-xs mx-auto">There are no screenings matching your search or scheduled for this cinema.</p>
                    </div>
                )}
            </div>

            {isPopupOpen && (
                <AddShowtime
                    isPopupOpen={isPopupOpen}
                    setIsPopupOpen={setIsPopupOpen}
                    cinemaId={cinemaId as string}
                    setCinema={setCinema as React.Dispatch<React.SetStateAction<Cinema | null>>}
                />
            )}

            {isDeletePopupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-sm border border-slate-100 transform animate-in zoom-in-95 duration-300 text-center relative">
                        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Trash2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Delete Showtime?</h2>
                        <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
                            Are you sure you want to remove <span className="text-slate-900 font-bold">&quot;{showtimeToDelete?.movie.title}&quot;</span> at {showtimeToDelete?.time}?
                        </p>
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={handleDeleteShowtime}
                                className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95"
                            >
                                Yes, Delete Screening
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

export default ShowTimeView;