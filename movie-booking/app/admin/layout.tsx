"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminNavbar";
import { useAlert } from "@/app/context/AlertContext";
import LoadTwo from "@/app/components/ui/loading/loadTwo";
import Footer from "../components/Footer";

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
    }, 2000);
    return () => clearTimeout(loadingTimer);
  }, []);

  return (
    <div className="bg-white flex min-h-screen md:flex-row">
    {loading && <LoadTwo />}

        {/* Sidebar: คงที่ที่ขนาด 250px */}
        <div className="w-72 bg-gray-100 border-r">
            <AdminSidebar />
        </div>

        {/* Main Content: ขยายเต็มพื้นที่ */}
        <div className="flex flex-col flex-grow">
            <main className="flex-grow p-6 md:p-8 overflow-y-auto">{children}</main>

            {/* Footer */}
            <Footer />
        </div>
    </div>
  );
}
