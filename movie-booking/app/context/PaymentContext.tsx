"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import Stripe from "stripe";

type PaymentContextType = {
  paymentStatus: string | null;
  checkPaymentStatus: (sessionId: string) => Promise<void>;
};

const PaymentContext = createContext<PaymentContextType | null>(null);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const checkPaymentStatus = async (sessionId: string) => {
    try {
      const stripe = new Stripe(process.env.STRIPE_PUBLISHABLE_KEY!);
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        setPaymentStatus("Payment Successful");
      } else {
        setPaymentStatus("Payment Failed");
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      setPaymentStatus("Error checking payment status");
    }
  };

  return (
    <PaymentContext.Provider value={{ paymentStatus, checkPaymentStatus }}>
      {children}
    </PaymentContext.Provider>
  );
};