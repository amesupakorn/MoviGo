"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/setLogged";
import { LuTicketCheck } from "react-icons/lu";

const UserDropdown = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenMobile, setIsDropdownOpenMobile] = useState(false);



  return (
    <div>
      {isLoggedIn ? (
        <div className="relative">
          {/* Profile Image */}
          <img
            src={user?.profileImage || "/uploads/profile-default.png"}
            alt="User Profile"
            className="w-8 h-8 rounded-full cursor-pointer border border-gray-300 hidden md:block"
            onMouseEnter={() => setIsDropdownOpen(true)}
          />

          <p
            className="cursor-pointer md:hidden flex items-center justify-between"
            onClick={() => setIsDropdownOpenMobile(!isDropdownOpenMobile)} 
          >
            {user?.name}
            <svg
              className={`ml-2 w-4 h-4 transform transition-transform duration-300 ${
                isDropdownOpenMobile ? "rotate-180" : "rotate-0"
              }`} // Rotate arrow when dropdown is open
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </p>


          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              className="absolute right-0 mr-2 w-64 bg-white shadow-lg rounded-lg py-3 z-20"
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              {/* User Info */}
              <div className="flex items-center px-4 pb-3 border-b">
                <img
                  src={user?.profileImage || "/uploads/profile-default.png"}
                  alt="User Profile"
                  className="w-12 h-12 rounded-full border border-gray-300 "
                />

                <div className="ml-4">
                  <h4 className="text-gray-800 font-semibold">{user?.name}</h4>
                  <div className="flex space-x-1 items-center">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                    <p className="text-green-500 text-xs font-medium">Verified</p>
                  </div>
                </div>
              </div>

              <ul className="mt-3">
                <Link href="/client/profile/">
                  <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <svg
                      className="h-5 w-5 text-zinc-800"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="ml-3 text-gray-700">Profile</span>
                  </li>
                </Link>
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <LuTicketCheck className="w-5 h-5" />
                  <span className="ml-3 text-gray-700">Booking History</span>
                </li>
                <li
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={logout}
                >
                  <svg
                    className="h-5 w-5 text-zinc-800"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                    <path d="M7 12h14l-3 -3m0 6l3 -3" />
                  </svg>
                  <span className="ml-3 text-gray-700">Logout</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <Link href="/client/auth/login">
          <button className="bg-gray-900 w-full  text-white font-medium rounded-lg px-5 py-1.5 hover:bg-gray-600">
            Login
          </button>
        </Link>
      )}

      {/* แสดงข้อมูลสำหรับหน้าจอเล็ก */}
      {isDropdownOpenMobile && (
        <div className="text-gray-500">

          <ul className="mt-2">
                <Link href="/client/profile/">
                  <li className="flex items-center cursor-pointer">

                    <span className="ml-3 hover:text-blue-500 text-gray-500">Profile</span>
                  </li>
                </Link>
                <li className="flex items-center hover:text-blue-500 cursor-pointer mb-1">
                  <span className="ml-3 text-gray-500">Booking History</span>
                </li>

                <li
                  className="flex items-center hover:text-blue-500 cursor-pointer border-t-2 mt-2 mb-2"
                  onClick={logout}
                >
                  <span className="ml-3 text-red-500">Logout</span>
                </li>
              </ul>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;