"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminNavbar";
import AdminTopbar from "../components/AdminTopbar";
import { useAlert } from "@/app/context/AlertContext";
import LoadTwo from "@/app/components/ui/loading/loadTwo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const { success, setSuccess } = useAlert();
  const { error, setError } = useAlert();

  useEffect(() => {
    if (success) {
      const successTimer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(successTimer);
    }
    if (error) {
      const errorTimer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(errorTimer);
    }
  }, [success, error]);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Reduced loading time slightly for better UX
    return () => clearTimeout(loadingTimer);
  }, []);

  return (
    <div className="bg-slate-50 flex min-h-screen">
      {loading && <LoadTwo />}

      {/* Sidebar - Fixed width */}
      <div className="w-72 flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow min-w-0">
        {/* Topbar */}
        <AdminTopbar />

        {/* Dynamic Content */}
        <main className="flex-grow p-8 lg:p-10">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>

        {/* Footer could go here if needed, but modern dashboards often omit it or keep it simple */}
      </div>

      {/* Global Alerts Portal (Toast-style) */}
      {(success || error) && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-right-10 duration-300">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border ${
            success ? "bg-emerald-500 text-white border-emerald-400" : "bg-red-500 text-white border-red-400"
          }`}>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-bold text-sm tracking-wide capitalize">{success || error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
