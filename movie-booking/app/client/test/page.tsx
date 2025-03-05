"use client";
import { useEffect, useState } from "react";

export default function CinemaSeatBooking() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [reservedSeats, setReservedSeats] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001"); 
    setSocket(ws);

    ws.onmessage = async (event) => {
        try {
          if (event.data instanceof Blob) {
            const text = await event.data.text(); 
            const seatData = JSON.parse(text);
            console.log("📢 New seat booked:", seatData);
      
            setReservedSeats((prev) => [...prev, `${seatData.row}${seatData.number}`]);
          } else {
            // ✅ ถ้าไม่ใช่ Blob ให้แปลง JSON ตรงๆ
            const seatData = JSON.parse(event.data);
            console.log("📢 New seat booked:", seatData);
            setReservedSeats((prev) => [...prev, `${seatData.row}${seatData.number}`]);
          }
        } catch (error) {
          console.error("❌ Error parsing WebSocket message:", error);
        }
      };

    ws.onclose = () => console.log("❌ WebSocket disconnected");

    return () => ws.close();
  }, []);

  const isReserved = (seat: string) => reservedSeats.includes(seat);

  const handleSelectSeat = (seat: string) => {
    if (!isReserved(seat)) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleSubmitBooking = () => {
    if (!socket) return;

    selectedSeats.forEach((seat) => {
      const row = seat.charAt(0);
      const number = parseInt(seat.slice(1), 10);
      const seatData = { row, number, price: 320 };

      socket.send(JSON.stringify(seatData)); // ✅ ส่งข้อมูลผ่าน WebSocket
    });
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