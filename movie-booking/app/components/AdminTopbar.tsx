"use client";

import { Bell, Search, User } from "lucide-react";

const AdminTopbar = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center flex-1">
        <div className="relative w-96 max-w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            placeholder="Search everything..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 mx-2"></div>
        
        <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-700">Admin User</p>
            <p className="text-xs text-gray-500 font-medium">System Manager</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 border border-amber-200 shadow-sm">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
