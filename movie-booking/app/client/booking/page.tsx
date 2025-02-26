"use client";

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '@/app/components/CheckoutForm';

const stripePromise = loadStripe("pk_test_51QweawJz6OL7wVPkZ3xEgY2E16QhPYWjzYvPLnf3MDTJVaOKvyjlMSLq2hAJyxGigAFEvBD5aqz8uuQkpKZT28QK00a3VShUcg");  

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Checkout;