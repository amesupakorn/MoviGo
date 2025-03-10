"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";
import { Location, Cinema} from "@/lib/types/booking";
import Link from "next/link";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi"; 
import { useAlert } from "@/app/context/AlertContext";

const AddCinema = () => {
  const router = useRouter();
  const { id: locationId } = useParams(); // ดึงค่า locationId จาก URL
  const [location, setLocation] = useState<Location | null>(null);
  const [cinemaName, setCinemaName] = useState("");
  const [cinemaType, setCinemaType] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [editingCinema, setEditingCinema] = useState<Cinema | null>(null);
  const [cinemaToDelete, setCinemaToDelete] = useState<Cinema | null>(null);
  const { setError, setSuccess } = useAlert();   
  

  // ดึงข้อมูลโรงหนังของ Location ที่เลือก
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await api.get(`/location/${locationId}`);
        setLocation(response.data);
      } catch (error) {
        console.error("Error fetching cinemas:", error);
      }
    };
    if (locationId) fetchCinemas();
  }, [locationId]);

  // ฟังก์ชันเพิ่ม/อัปเดตโรงหนัง
  const handleCreateOrUpdateCinema = async () => {
    if (!cinemaName || !cinemaType) return;
  
    setLoading(true);
    try {
      if (editingCinema) {
        // แก้ไขโรงหนัง
        const response = await api.put("/cinema", {
          id: editingCinema.id,
          name: cinemaName,
          type: cinemaType,
          locationId,
        });

        setSuccess("Update Success")
        setLocation((prev) => ({
          ...prev!,
          subCinemas: prev!.subCinemas.map((cinema) =>
            cinema.id === editingCinema.id ? response.data : cinema
          ),
        }));
      } else {
        // เพิ่มโรงหนัง
        const response = await api.post(`/cinema`, {
          name: cinemaName,
          type: cinemaType,
          locationId,
        });
        setSuccess("Add New Cinema Success")

        setLocation((prev) => ({
          ...prev!,
          subCinemas: [...prev!.subCinemas, response.data],
        }));
      }
      setIsPopupOpen(false);
      setCinemaName("");
      setCinemaType("");
      setEditingCinema(null);
    } catch (error) {
      console.error("Error adding/updating cinema:", error);
    }
    setLoading(false);
  };

  // ฟังก์ชันลบโรงหนัง
  const handleDeleteCinema = async () => {
    if (!cinemaToDelete) return;
  
    try {
      await api.delete(`/cinema`, { data: { id: cinemaToDelete.id } });
      setLocation((prev) => ({
        ...prev!,
        subCinemas: prev!.subCinemas.filter((cinema) => cinema.id !== cinemaToDelete.id),
      }));
      setIsDeletePopupOpen(false);
      setCinemaToDelete(null);
    } catch (error) {
      console.error("Error deleting cinema:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl p-6">
        <div className="flex justify-between items-center pb-4 border-b border-gray-300">
            <h2 className="text-2xl font-semibold text-gray-800">
                    Manage Location: <span className="text-amber-600">{location?.name ? location.name : ""}</span>
                </h2>
        
        <button
          onClick={() => {
            setCinemaName("");
            setCinemaType("");
            setEditingCinema(null);
            setIsPopupOpen(true);
          }}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 flex items-center gap-2"
        >
          <FiPlus /> Add Cinema
        </button>
      </div>

      {/* รายการโรงหนัง */}
      <ul className="flex flex-col space-y-3 mt-4">
        {location?.subCinemas.map((cinema) => (
          <div
            key={cinema.id}
            className="bg-white p-4 border border-gray-300 rounded-3xl flex justify-between items-center shadow-md hover:shadow-lg transition-all"
            >
            <Link href={`/admin/showtime/${cinema.id}`} className="flex-grow">
              <h3 className="text-black text-sm font-bold mb-2">{cinema.name}</h3>
              <p className="text-gray-600 text-sm max-sm:text-xs">Type: {cinema.type}</p>
            </Link>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setEditingCinema(cinema);
                  setCinemaName(cinema.name);
                  setCinemaType(cinema.type);
                  setIsPopupOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                <FiEdit size={18} />
              </button>
              <button
                onClick={() => {
                  setCinemaToDelete(cinema);
                  setIsDeletePopupOpen(true);
                }}
                className="text-red-600 hover:text-red-800"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </ul>

      {/* ✅ Popup สำหรับเพิ่ม/แก้ไข Cinema */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">{editingCinema ? "Edit Cinema" : "Add Cinema"}</h2>

            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={cinemaName}
              onChange={(e) => setCinemaName(e.target.value)}
              className="w-full p-2 border rounded-lg mt-1"
            />

            <label className="block text-sm font-medium text-gray-700 mt-3">Type</label>
            <input
              type="text"
              value={cinemaType}
              onChange={(e) => setCinemaType(e.target.value)}
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
                onClick={handleCreateOrUpdateCinema}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingCinema ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Popup ยืนยันการลบ Cinema */}
      {isDeletePopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-lg font-bold mb-4 text-red-600">Confirm Delete</h2>
            <p className="text-gray-700">Are you sure you want to delete <strong>{cinemaToDelete?.name}</strong>?</p>
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={() => setIsDeletePopupOpen(false)}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCinema}
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

export default AddCinema;