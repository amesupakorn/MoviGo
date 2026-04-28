"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function CinemaSeatBooking() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [reservedSeats, setReservedSeats] = useState<string[]>([]);

  // Poll for seat updates (replaces WebSocket for Vercel compatibility)
  useEffect(() => {
    // This is a test page - adapt with a real showtime ID as needed
    const interval = setInterval(async () => {
      try {
        // Replace with actual showtime ID for testing
        const response = await api.get("/seats/test-showtime-id");
        if (response.data) {
          const seats = response.data.map((s: { row: string; number: number }) => `${s.row}${s.number}`);
          setReservedSeats(seats);
        }
      } catch {
        // Silently handle errors in test page
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const isReserved = (seat: string) => reservedSeats.includes(seat);

  const handleSelectSeat = (seat: string) => {
    if (!isReserved(seat)) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleSubmitBooking = async () => {
    // In production, this would call the booking API
    console.log("Selected seats:", selectedSeats);
  };

  return (
    <div className="mt-24">
      <h1>เลือกที่นั่ง</h1>
      <div className="seats">
        {["A1", "A2", "A3", "B1", "B2"].map((seat) => (
          <button
            key={seat}
            onClick={() => handleSelectSeat(seat)}
            disabled={isReserved(seat)}
            style={{ background: isReserved(seat) ? "red" : "green" }}
          >
            {seat}
          </button>
        ))}
      </div>
      <button onClick={handleSubmitBooking}>ยืนยันการจอง</button>
    </div>
  );
}