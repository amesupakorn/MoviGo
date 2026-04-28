import { NextRequest, NextResponse } from "next/server";
import { createPaymentSession } from "@/lib/payment";

export async function POST(req: NextRequest) {
  try {
    const { selectedSeats, bookedSeats, showtimeId, user } = await req.json();

    if (!selectedSeats || !user || !bookedSeats) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await createPaymentSession(selectedSeats, bookedSeats, showtimeId, user);
    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    console.error("Error creating payment session:", error);
    return NextResponse.json({ error: error.message || "Error creating payment session" }, { status: 500 });
  }
}