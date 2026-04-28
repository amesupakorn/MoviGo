"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { Location, Cinema } from "@/lib/types/booking";
import Link from "next/link";
import LoadTwo from "@/app/components/ui/loading/loadTwo";
import { MapPin, Plus, Trash2, Edit3, ChevronRight, X, Monitor } from "lucide-react";
import { useAlert } from "@/app/context/AlertContext";

const AddCinema = () => {
  const { id: locationId } = useParams();
  const [location, setLocation] = useState<Location | null>(null);
  const [cinemaName, setCinemaName] = useState("");
  const [cinemaType, setCinemaType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [editingCinema, setEditingCinema] = useState<Cinema | null>(null);
  const [cinemaToDelete, setCinemaToDelete] = useState<Cinema | null>(null);
  const { setSuccess, setError } = useAlert();

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/location/${locationId}`);
        setLocation(response.data);
      } catch {
        setError("Error fetching cinemas");
      } finally {
        setIsLoading(false);
      }
    };
    if (locationId) fetchCinemas();
  }, [locationId, setError]);

  const handleCreateOrUpdateCinema = async () => {
    if (!cinemaName || !cinemaType) {
      setError("Please fill in all fields");
      return;
    }

    try {
      if (editingCinema) {
        const response = await api.put("/cinema", {
          id: editingCinema.id,
          name: cinemaName,
          type: cinemaType,
          locationId,
        });

        setSuccess("Cinema updated successfully");
        setLocation((prev) => ({
          ...prev!,
          subCinemas: prev!.subCinemas.map((cinema) =>
            cinema.id === editingCinema.id ? response.data : cinema
          ),
        }));
      } else {
        const response = await api.post(`/cinema`, {
          name: cinemaName,
          type: cinemaType,
          locationId,
        });
        setSuccess("New cinema added successfully");

        setLocation((prev) => ({
          ...prev!,
          subCinemas: [...prev!.subCinemas, response.data],
        }));
      }
      setIsPopupOpen(false);
      setCinemaName("");
      setCinemaType("");
      setEditingCinema(null);
    } catch {
      setError("Failed to process request");
    }
  };

  const handleDeleteCinema = async () => {
    if (!cinemaToDelete) return;

    try {
      await api.delete(`/cinema`, { data: { id: cinemaToDelete.id } });
      setLocation((prev) => ({
        ...prev!,
        subCinemas: prev!.subCinemas.filter((cinema) => cinema.id !== cinemaToDelete.id),
      }));
      setSuccess("Cinema deleted successfully");
      setIsDeletePopupOpen(false);
      setCinemaToDelete(null);
    } catch {
      setError("Failed to delete cinema");
    }
  };

  if (isLoading) return <LoadTwo />;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-600 mb-2 font-black uppercase tracking-widest text-[10px]">
            <MapPin className="w-3 h-3" />
            <span>{location?.name}</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Cinemas</h1>
          <p className="text-slate-500 font-medium mt-1">Configure individual cinema screens and display systems.</p>
        </div>

        <button
          onClick={() => {
            setCinemaName("");
            setCinemaType("");
            setEditingCinema(null);
            setIsPopupOpen(true);
          }}
          className="px-6 py-3.5 bg-amber-500 text-white rounded-2xl font-bold text-sm hover:bg-amber-600 transition-all flex items-center shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Cinema
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {location?.subCinemas.map((cinema) => (
          <div
            key={cinema.id}
            className="group bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
          >
            <div className="flex items-center space-x-5 flex-grow">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-amber-500 group-hover:bg-amber-50 group-hover:border-amber-100 transition-all">
                <Monitor className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{cinema.name}</h2>
                <p className="text-slate-500 text-sm font-medium">{cinema.type} System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0 ml-auto sm:ml-0">
              <button
                onClick={() => {
                  setEditingCinema(cinema);
                  setCinemaName(cinema.name);
                  setCinemaType(cinema.type);
                  setIsPopupOpen(true);
                }}
                className="p-3 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-200"
                title="Edit Cinema"
              >
                <Edit3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setCinemaToDelete(cinema);
                  setIsDeletePopupOpen(true);
                }}
                className="p-3 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200"
                title="Delete Cinema"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <Link
                href={`/admin/showtime/${cinema.id}`}
                className="p-3 text-slate-400 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-xl transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {location?.subCinemas.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Monitor className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No cinemas available</h3>
          <p className="text-slate-500 mt-2 max-w-xs mx-auto">Create individual cinema screens to start managing showtimes.</p>
        </div>
      )}

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
              {editingCinema ? <Edit3 className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-2">
              {editingCinema ? "Edit Cinema" : "Add New Cinema"}
            </h2>
            <p className="text-slate-500 text-sm font-medium mb-8">
              {editingCinema ? "Update the configuration for this screen." : "Configure a new screen for this branch."}
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Cinema Name</label>
                <input
                  type="text"
                  placeholder="e.g. Cinema 01"
                  value={cinemaName}
                  onChange={(e) => setCinemaName(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Cinema Type</label>
                <input
                  type="text"
                  placeholder="e.g. IMAX, 4DX, Standard"
                  value={cinemaType}
                  onChange={(e) => setCinemaType(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
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
                onClick={handleCreateOrUpdateCinema}
                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
              >
                {editingCinema ? "Save Changes" : "Create Cinema"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeletePopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-sm border border-slate-100 transform animate-in zoom-in-95 duration-300 text-center relative">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Trash2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Delete Cinema?</h2>
            <p className="text-slate-500 text-sm font-medium mb-8">
              Are you sure you want to delete <span className="text-slate-900 font-bold">&quot;{cinemaToDelete?.name}&quot;</span>? This action cannot be undone.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleDeleteCinema}
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

export default AddCinema;