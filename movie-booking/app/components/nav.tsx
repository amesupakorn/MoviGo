"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserDropdown from "./ui/userDrop";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { MovieSearchResponse } from "@/lib/types/movieSearch";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<MovieSearchResponse | null>(null);
  const [, setIsSearching] = useState(false);

  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const currentPath = pathname.split("/").pop()?.toUpperCase(); 
    setActiveMenu(currentPath || null);
  }, [pathname]);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!searchTerm.trim()) {
        setSearchResults(null);
        return;
      }
      setIsSearching(true);
      try {
        const response = await api.get(`/search`, {
          params: { query: searchTerm, language: "en-US" },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsSearching(false);
      }
    };
    const delayDebounceFn = setTimeout(fetchMovies, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSelectMovie = () => {
    setSearchTerm("");
  };
  
  const menus = ["HOME", "CINEMAS"];

  return (
    <nav className="bg-zinc-900 shadow-md fixed w-full md:p-0 p-2 top-0 z-10">
      <div className="container mx-auto px-4 mt-4">
        <div className="flex items-center justify-between">
          <button
            className="md:hidden text-gray-500 hover:text-blue-500"
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
              <svg className="h-6 w-6 text-white"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="4" y1="6" x2="20" y2="6" />  <line x1="4" y1="12" x2="14" y2="12" />  <line x1="4" y1="18" x2="18" y2="18" /></svg>

            )}
          </button>
          {/* Logo */}

          <div className="text-2xl font-bold text-white">MovieGo</div>

          <Link href='/client/history' >
              <svg className="h-6 w-6 text-white"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />  <line x1="3" y1="6" x2="21" y2="6" />  <path d="M16 10a4 4 0 0 1-8 0" /></svg>
            </Link>
          {/* Search Bar */}
          <div className="hidden md:flex flex-grow mx-8 relative">
            <div className="w-full max-w-[600px] mx-auto flex bg-zinc-700 rounded-lg overflow-hidden relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow bg-transparent outline-none px-4 py-2 text-white text-sm placeholder-gray-400"
              />
              <div className="px-3 flex items-center justify-center">
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
              </div>
            </div>
            {/* Results */}
            {searchResults && (
              <div className="absolute left-1/2 transform  -translate-x-1/2 w-full max-w-[600px] bg-zinc-800 mt-9 rounded-lg shadow-lg max-h-80 overflow-y-auto z-10 ">
                {searchResults.results.length > 0 ? (
                  searchResults.results.map((movie) => (
                    <Link
                      key={movie.id}
                      href={`/client/movie/${movie.id}`}
                      onClick={handleSelectMovie}
                      className="block px-4 py-2 text-white hover:bg-zinc-700"
                    >
                      {movie.title}
                    </Link>
                  ))
                ) : (
                  <p className="px-4 py-2 text-white">No results found</p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="w-[1px] h-6 bg-gray-600"></div>
            <Link href='/client/history' >
              <svg className="h-6 w-6 text-white"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />  <line x1="3" y1="6" x2="21" y2="6" />  <path d="M16 10a4 4 0 0 1-8 0" /></svg>
            </Link>
            <div className="items-center space-x-4">
              <UserDropdown  />
            </div>
          </div>
        </div>
        
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:flex flex-col md:flex-row md:justify-center mt-2 border-gray-200`}
        >
       <ul className="flex flex-col md:flex-row md:space-x-6 px-2 text-gray-700 font-medium items-left space-y-2 md:space-y-0">
            {menus.map((menu) => {
                const isActive = activeMenu === menu;

                return (
                <li key={menu} className="relative group ">
                    <Link
                    href={`/client/${menu.toLowerCase()}`}
                    className={`cursor-pointer relative text-sm flex items-left px-6 py-2 rounded-md transition-all duration-300 ${
                        isActive ? "text-amber-500 font-semibold" : "text-white"
                    } hover:text-amber-500`}
                    onClick={() => setActiveMenu(menu)}
                    >
                    {menu}
                    </Link>

                    <span
                    className={`absolute left-0 bottom-0 w-full h-[3px] bg-amber-400 transition-all duration-300 rounded-md ${
                        isActive ? "scale-x-100" : "scale-x-0"
                    } group-hover:scale-x-100`}
                    />
                </li>

    
                );
            })}
               <li className=" py-2 md:hidden">
                  <UserDropdown/>
                </li>
            </ul>
          

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
