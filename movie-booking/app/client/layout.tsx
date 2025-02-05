"use client";

import { useEffect } from "react";
import Navbar from "../components/nav";
import { useAlert } from "@/app/context/AlertContext";

export default function Layout({ children }: { children: React.ReactNode }) {

  const { success, setSuccess } = useAlert(); 
  const { error, setError} = useAlert();

  useEffect(() => {
    if (success) {
      setTimeout(() => setSuccess(null), 3000);
    }
    if (error) {
      setTimeout(() => setError(null), 3000);
    }
   }, );
   

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="">
        <Navbar />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}