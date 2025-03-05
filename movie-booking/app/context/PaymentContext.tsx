"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/lib/axios";

interface PaymentContextProps {
  paymentStatus: string | null;
  checkPaymentStatus: () => Promise<void>;
  cancelBooking: () => void;
}

const socket = new WebSocket("ws://localhost:3001");

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
        const response = await api.post("/booking/cancel", {
          sessionId,
        });

        if (response.data.canceledSeats) {

           response.data.canceledSeats.forEach((seat: { row: string; number: number }) => {
            const seatData = JSON.stringify({
              row: seat.row,
              number: seat.number,
              action: "release",
            });

            // Ensure WebSocket is open before sending
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(seatData);
            }
            console.log("Booking canceled successfully.");

        });

      }
    }} catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  return (
    <PaymentContext.Provider value={{ paymentStatus, checkPaymentStatus, cancelBooking }}>
      {children}
    </PaymentContext.Provider>
  );
};