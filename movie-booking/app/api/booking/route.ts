import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Prisma client
import { getUserFromToken } from "@/lib/auth"; // Helper function to get user from token

export async function POST(req: NextRequest) {
  try {
    const { selectedSeats, showtimeId, status }: { selectedSeats: string[], showtimeId: string, status: string } = await req.json();
    
    // Get user info from the request header
    const authHeader = req.headers.get("authorization");
    const user = await getUserFromToken(authHeader);
    
    // Ensure all required data is available
    if (!selectedSeats || !showtimeId || !user || !user.id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const userId = user.id; // User ID from the token

    const bookedSeats = [];

    for (const seatIdentifier of selectedSeats) {
      const [row, seatNumber] = seatIdentifier.split("-");

      // Check if the seat is available
      const seat = await prisma.seat.findUnique({
        where: {
          row_number_showtimeId: { row, number: parseInt(seatNumber), showtimeId }
        },
      });

      if (!seat || !seat.isAvailable) {
        return NextResponse.json({ error: `Seat ${seatIdentifier} is not available` }, { status: 400 });
      }

      // Create the booking record in the database
      const booking = await prisma.booking.create({
        data: {
          showtimeId,
          userId,
          seatId: seat.id,
          status, // reserved or other status
        },
      });

      // Update the seat status to unavailable
      await prisma.seat.update({
        where: { id: seat.id },
        data: { isAvailable: false },
      });

      bookedSeats.push(booking);
    }

    return NextResponse.json({ bookedSeats }, { status: 201 });
  } catch (error) {
    console.error("Error during seat booking:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}