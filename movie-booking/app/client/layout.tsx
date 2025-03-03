"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/nav";
import { useAlert } from "@/app/context/AlertContext";
import LoadTwo from "@/app/components/ui/loading/loadTwo";
import Footer from "../components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const { success, setSuccess } = useAlert(); 
  const { error, setError} = useAlert();

  useEffect(() => {
    // Reset success and error alerts after 3 seconds
    if (success) {
      const successTimer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(successTimer); // Cleanup timer when component unmounts
    }
    if (error) {
      const errorTimer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(errorTimer); // Cleanup timer when component unmounts
    }
  }, [success, error]); // Only re-run when success or error changes

  useEffect(() => {
    // Set loading to false after 2 seconds
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(loadingTimer); // Cleanup timer on component unmount
  }, []); // Empty dependency array, so it only runs on mount

  return (
    <div>
      <div className="bg-zinc-900 flex min-h-screen flex-col md:flex-row md:overflow-hidden">
          {loading && <LoadTwo />}

        <div className="">
          <Navbar />
        </div>

        <div className="flex-grow md:overflow-y-auto">{children}</div>
        
      </div>
      <div className="h-[120px] bg-zinc-900"></div>
      <Footer />
    </div>
  );
}