import { NextRequest, NextResponse } from "next/server";
import { Booking } from "@/lib/types/booking";
import { createPaymentSession } from "@/lib/payment";

export async function POST(req: NextRequest) {
  try {
    const { selectedSeats, bookedSeats, showtimeId, user }: { 
      selectedSeats: string[]; 
      bookedSeats: Booking[]; 
      showtimeId: string; 
      user: { id: string; name: string; email: string };
    } = await req.json();

    if (!selectedSeats || !user || !bookedSeats) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await createPaymentSession(selectedSeats, bookedSeats, showtimeId, user);
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error("Error creating payment session:", error);
    const errorMessage = error instanceof Error ? error.message : "Error creating payment session";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}