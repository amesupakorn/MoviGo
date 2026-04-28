"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  Film,
  MapPin,
  ChevronRight
} from "lucide-react";

const AdminSidebar = () => {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Locations", href: "/admin/location", icon: MapPin },
  ];

  const handleLogout = () => {
    // Actual logout logic should go here
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <aside className="bg-slate-900 h-screen w-72 flex flex-col fixed left-0 top-0 z-40 shadow-xl transition-all border-r border-slate-800">
        {/* Brand/Logo */}
        <div className="p-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Film className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">MoviGo</h1>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Admin ERP</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-grow px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  <div className="flex items-center">
                    <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? "text-white" : "group-hover:text-amber-400 text-slate-500"}`} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
                </Link>
              );
            })}
          </nav>


        </div>

        {/* User Account / Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <div className="bg-red-500/10 p-2 rounded-lg mr-3 group-hover:bg-red-500/20">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-100 transform animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <LogOut className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 text-center mb-2">
              Ready to leave?
            </h2>
            <p className="text-slate-500 text-center mb-8 text-sm">
              Are you sure you want to log out from the MoviGo ERP? You will need to login again to access management tools.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleLogout}
                className="w-full py-3.5 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95"
              >
                Yes, Sign Out
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="w-full py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
              >
                Stay Logged In
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
