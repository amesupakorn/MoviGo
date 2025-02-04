"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import UserDropdown from "./ui/userDrop";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const currentPath = pathname.split("/").pop()?.toUpperCase(); 
    setActiveMenu(currentPath || null);
  }, [pathname]);
  
  const menus = ["HOME", "MOVIES", "CINEMAS"];

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-10">
      <div className="container mx-auto px-4 mt-4">
        <div className="flex items-center justify-between">
          <button
            className="md:hidden text-gray-500 hover:text-red-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-zinc-900"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="4" y1="6" x2="20" y2="6" />  <line x1="4" y1="12" x2="14" y2="12" />  <line x1="4" y1="18" x2="18" y2="18" /></svg>

            )}
          </button>
          {/* Logo */}

          <div className="text-2xl font-bold text-gray-900">MovieGo</div>

          <svg className="md:hidden md:flex h-6 w-6 text-zinc-800"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />  <line x1="3" y1="6" x2="21" y2="6" />  <path d="M16 10a4 4 0 0 1-8 0" /></svg>

          {/* Search Bar */}
          <div className="hidden md:flex flex-grow mx-8">
            <div className="w-full max-w-[600px] mx-auto flex bg-gray-100 rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search here"
                className="flex-grow bg-transparent outline-none px-4 py-2 text-sm text-gray-700 placeholder-gray-400"
              />
              <button className="bg-blue-500 hover:bg-gray-600 px-3 flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="w-[1px] h-6 bg-gray-600"></div>

            <svg className="h-6 w-6 text-zinc-800"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />  <line x1="3" y1="6" x2="21" y2="6" />  <path d="M16 10a4 4 0 0 1-8 0" /></svg>

            <div className="items-center space-x-4">
              <UserDropdown />
            </div>
          </div>
        </div>
        
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:flex flex-col md:flex-row md:justify-center mt-2 border-gray-200`}
        >
       <ul className="flex flex-col md:flex-row md:space-x-6 text-gray-700 font-medium items-center space-y-3 md:space-y-0">
            {menus.map((menu) => {
                const isActive = activeMenu === menu;

                return (
                <li key={menu} className="relative group ">
                    <Link
                    href={`/client/${menu.toLowerCase()}`}
                    className={`cursor-pointer relative text-sm flex items-center justify-center px-6 py-2 rounded-md transition-all duration-300 ${
                        isActive ? "text-blue-500 font-semibold" : "text-gray-700"
                    } hover:text-blue-500`}
                    onClick={() => setActiveMenu(menu)}
                    >
                    {menu}
                    </Link>

                    <span
                    className={`absolute left-0 bottom-0 w-full h-[3px] bg-blue-500 transition-all duration-300 rounded-md ${
                        isActive ? "scale-x-100" : "scale-x-0"
                    } group-hover:scale-x-100`}
                    />
                </li>
                );
            })}
            </ul>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
