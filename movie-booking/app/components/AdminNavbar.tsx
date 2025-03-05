"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, PlusCircle, LogOut, XCircle } from "lucide-react";

const AdminSidebar = () => {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logging out..."); // ✅ Replace this with actual logout logic
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      {/* Sidebar */}
      <aside className="bg-white shadow-md fixed top-0 left-0 h-full w-72 px-6 py-6 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="text-xl font-bold text-gray-800 mb-6">Admin Panel</div>

          {/* Navigation Menu */}
          <nav className="flex flex-col space-y-2">
            <Link
              href="/admin"
              className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                pathname === "/admin"
                  ? "bg-amber-100 text-amber-600"
                  : "text-gray-700 hover:bg-amber-50 hover:text-amber-600"
              }`}
            >
              <Calendar className="w-5 h-5 mr-3" />
              Showtimes
            </Link>

            <Link
              href="/admin/addLocation"
              className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                pathname === "/admin/addLocation"
                  ? "bg-amber-100 text-amber-600"
                  : "text-gray-700 hover:bg-amber-50 hover:text-amber-600"
              }`}
            >
              <PlusCircle className="w-5 h-5 mr-3" />
              Add Showtime
            </Link>
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </aside>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="text-sm px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
