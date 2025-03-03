"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/lib/axios";

interface PaymentContextProps {
  paymentStatus: string | null;
  checkPaymentStatus: () => Promise<void>;
  cancelBooking: () => void;
}

const PaymentContext = createContext<PaymentContextProps | undefined>(undefined);

export const usePaymentContext = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePaymentContext must be used within a PaymentProvider");
  }
  return context;
};

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null); 

  useEffect(() => {
    checkPaymentStatus(); 
  }, []);

  useEffect(() => {
    if (paymentStatus && paymentStatus !== "complete" && sessionId) {
      cancelBooking();
    }
  }, [paymentStatus, sessionId]); 

  const checkPaymentStatus = async () => {
    try {

        const res_cookie = await api.get(`/cookie/`)
        const cookie = res_cookie.data.session

        if (!cookie) return;

        setSessionId(cookie); 
        // Fetch payment status from backend
        const response = await api.get(`/payment/status`, { params: { cookie } });
        setPaymentStatus(response.data.status);
      } catch (error) {
        console.error("Error checking payment status:", error);
    }
  };

  // Function to cancel the booking if payment is not completed
  const cancelBooking = async () => {
    try {
      if (paymentStatus !== "complete" && sessionId) {
        await api.post("/booking/cancel", {
          sessionId,
        });
        console.log("Booking canceled successfully.");
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  return (
    <PaymentContext.Provider value={{ paymentStatus, checkPaymentStatus, cancelBooking }}>
      {children}
    </PaymentContext.Provider>
  );
};