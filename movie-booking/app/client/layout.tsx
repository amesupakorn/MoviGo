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
    if (success) {
      setTimeout(() => setSuccess(null), 3000);
    }
    if (error) {
      setTimeout(() => setError(null), 3000);
    }
    
    setTimeout(() => {
      setLoading(false);
    }, 2000);

   }, );
   

  return (
    <div>
      <div className="flex min-h-screen flex-col md:flex-row md:overflow-hidden">
          {loading && <LoadTwo />}

        <div className="">
          <Navbar />
        </div>

        <div className="flex-grow md:overflow-y-auto">{children}</div>
        
      </div>
    <Footer />
    </div>
  );
}