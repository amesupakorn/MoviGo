
"use client";

import React, { useEffect, useState } from "react";
import Loading from "@/app/components/ui/loading/loadOne";
import { useParams } from "next/navigation";
import { Order } from "@/lib/types/booking"
import api from "@/lib/axios";

const PaymentPageError = () => {
  const [isLoadingTry, setIsLoadingTry] = useState(false);
  const [isLoadingHome, setIsLoadingHome] = useState(false);
  const [, setOrder] =  useState<Order | null>(null);

  const { id } = useParams();

   useEffect(() => {
  
          const fetchData = async () => {
              try {
                const response = await api.get(`/booking/${id}`);
                setOrder(response.data)

                if(response.data.status == 'complete'){
                  window.location.href = `/payment/success/${id}`;
                }
  
              } catch (err) {
                  console.error("Error fetching movie details:", err);
              }
          };
  
          fetchData();
      }, [id]);

  // เปลี่ยนเส้นทางกลับไปยังหน้าจ่ายเงิน
  const handleBackToPayment = () => {
    setIsLoadingTry(true);

    setTimeout(() => {
      window.location.href = '/client/payment';
      setIsLoadingTry(false);
    }, 2000);
  }

  const handleChangePage = () =>{
    setIsLoadingHome(true);

    setTimeout(() => {
      window.location.href = '/client/home';
      setIsLoadingHome(false);

   }, 1000);

  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg md:shadow-lg text-center max-w-lg w-full">
        {/* แสดงรูปภาพ Error */}
        <div className="flex justify-center mb-6">
          <img
            src="/image/error.png" 
            className="w-[200px]"
            alt="Error"
          />
        </div>

        {/* ข้อความที่แสดงในหน้า error */}
        <h2 className="text-3xl font-semibold text-red-500 mb-4">Transaction Failed</h2>
        <p className="text-gray-600 mb-6">Error Processing Payment</p>
        <p className="text-sm text-gray-500 mb-8">
          Please check your security code, card details, and connection and try again.
        </p>

        {/* ปุ่มกลับไปยังหน้าจ่ายเงิน */}
        <button
          disabled={isLoadingTry}
          onClick={handleBackToPayment}
          className={`w-full mb-2 rounded rounded-3xl flex justify-center items-center font-medium transition ${
            isLoadingTry ? "bg-red-200 py-1 cursor-not-allowed" : "bg-red-600 py-3 text-white hover:bg-red-500"
          }`}
        >
          {isLoadingTry ? <Loading/>  : "Try again"}
        </button>
        <button
          disabled={isLoadingHome}
          onClick={handleChangePage}
          className={`w-full mb-2 rounded rounded-3xl flex justify-center items-center font-medium transition ${
            isLoadingHome ? "bg-red-200 py-1 cursor-not-allowed" : "py-3 text-red-500 border border-red-500 hover:bg-red-100"
          }`}
        >
          {isLoadingHome ? <Loading/>  : "Back to Homepage"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPageError;