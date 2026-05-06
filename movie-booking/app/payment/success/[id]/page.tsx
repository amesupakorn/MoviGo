"use client"
import React, { useEffect, useState } from "react";
import Loading from "@/app/components/ui/loading/loadOne";
import { useParams } from "next/navigation";
import { Order } from "@/lib/types/booking"
import api from "@/lib/axios";

const PaymentPageSuccess = () => {

  const [isLoading, setIsLoading] = useState(false);
  
  const [, setOrder] =  useState<Order | null>(null);
  const { id } = useParams();

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;

    const fetchData = async () => {
      try {
        const response = await api.get(`/booking/${id}`);
        const orderData = response.data;
        setOrder(orderData);

        if (orderData.status === "complete") {
          setIsLoading(false);
          return;
        }

        // If not complete, retry after a short delay
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(fetchData, 2000); // Wait 2 seconds before retry
        } else {
          // If still not complete after retries, redirect to cancel
          window.location.href = `/payment/cancel/${id}`;
        }
      } catch (err) {
        console.error("Error fetching order status:", err);
        // On error, maybe it's just a network issue, could retry too
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(fetchData, 2000);
        }
      }
    };

    setIsLoading(true);
    fetchData();
  }, [id]);

  const handleChangePage = () =>{
    setIsLoading(true);

    setTimeout(() => {
      window.location.href = '/client/home';
      setIsLoading(false);

   }, 1000);

  }
   

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg md:shadow-lg text-center max-w-lg w-full">

        <div className="flex justify-center mb-6">
          <img src="/image/success.png" className="w-[200px]" alt="success" />
        </div>

        {isLoading ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Verifying Payment...</h2>
            <p className="text-gray-600 mb-6">Please wait while we confirm your transaction.</p>
            <div className="flex justify-center mb-8">
               <Loading />
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Thank You!</h2>
            <p className="text-gray-600 mb-6">Payment done Successfully</p>
            <p className="text-sm text-gray-500 mb-8">
              You will be redirected to the home page shortly or click here to
              return to home page.
            </p>
            <button
              disabled={isLoading}
              onClick={handleChangePage}
              className={`w-full mb-2 rounded rounded-3xl flex justify-center items-center font-medium transition bg-gray-900 py-3 text-white hover:bg-gray-700`}
            >
              Home
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default PaymentPageSuccess;