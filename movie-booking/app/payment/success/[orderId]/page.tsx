"use client"
import React, { useEffect, useState } from "react";
import Loading from "@/app/components/ui/loading/loadOne";
import { useParams } from "next/navigation";
import { Order } from "@/lib/types/booking"
import api from "@/lib/axios";

const PaymentPageSuccess = () => {

  const [isLoading, setIsLoading] = useState(false);
  
  const [, setOrder] =  useState<Order | null>(null);
  const { orderId } = useParams();

  useEffect(() => {
          if (!orderId) return;
  
          const fetchData = async () => {
              try {
                const response = await api.get(`/booking/${orderId}`);
                setOrder(response.data)
  
              } catch (err) {
                  console.error("Error fetching movie details:", err);
              }
          };
  
          fetchData();
      }, [orderId]);
  const handleChangePage = () =>{
    setIsLoading(true);

    setTimeout(() => {
      window.location.href = '/client/home';
      setIsLoading(false);

   }, 2000);

  }
   

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg md:shadow-lg text-center max-w-lg w-full">

        <div className="flex justify-center mb-6">
          <img src="/image/success.png" className="w-[200px]" alt="success" />
        </div>

        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Thank You!</h2>
        <p className="text-gray-600 mb-6">Payment done Successfully</p>
        <p className="text-sm text-gray-500 mb-8">
          You will be redirected to the home page shortly or click here to
          return to home page.
        </p>
        <button
                    disabled={isLoading}
                    onClick={handleChangePage}
                    className={`w-full mb-2 rounded rounded-3xl flex justify-center items-center font-medium transition ${
                    isLoading ? "bg-gray-400 py-1 cursor-not-allowed" : "bg-gray-900 py-3 text-white hover:bg-gray-700"
                    }`}>
                    {isLoading ? <Loading /> : "Home"}
                  </button>
      </div>
    </div>
  );
};

export default PaymentPageSuccess;