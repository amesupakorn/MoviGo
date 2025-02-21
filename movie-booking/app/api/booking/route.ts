import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Prisma client
import { getUserFromToken } from "@/lib/auth"; // Helper function to get user from token

export async function POST(req: NextRequest) {
  try {
    const { selectedSeats, showtimeId, status }: { selectedSeats: string[], showtimeId: string, status: string } = await req.json();
    
    // Log request data to verify it's being passed correctly
    console.log("Request Data:", { selectedSeats, showtimeId, status });

    // Get user info from the request header
    const authHeader = req.headers.get("authorization");
    const user = await getUserFromToken(authHeader);
    
    if (!selectedSeats || !showtimeId || !user || !user.id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = user.id; // User ID from the token
    const bookedSeats = [];
    const premiumRows = ["A", "B", "C", "D", "E", "F"];

    console.log("User ID:", userId); // Log user ID to verify

    for (const seatIdentifier of selectedSeats) {
      const match = seatIdentifier.match(/^([A-Za-z]+)(\d+)$/);

      if (match) {
        const row = match[1];        
        const seatNumber = match[2];

        let seat = await prisma.seat.findUnique({
          where: {
            row_number_showtimeId: { row, number: parseInt(seatNumber), showtimeId }
          },
        });

        console.log("Seat:", seat); // Log seat identifier

        if (!seat) {
          console.log("Seat not found, creating new seat...");
          seat = await prisma.seat.create({
            data: {
              row,
              number: parseInt(seatNumber),
              price: premiumRows.includes(row) ? 350 : 320,
              showtimeId,
              isAvailable: true,
            },
          });
        }

        if (!seat.isAvailable) {
          return NextResponse.json({ error: `Seat ${seatIdentifier} is not available` }, { status: 400 });
        }

        // Create the booking record in the database
        const booking = await prisma.booking.create({
          data: {
            showtimeId,
            userId,
            seatId: seat.id,
            status,
          },
        });

        // Update the seat status to unavailable after booking
        await prisma.seat.update({
          where: { id: seat.id },
          data: { isAvailable: false },
        });

        bookedSeats.push(booking);
      } else {
        console.error(`Invalid seat identifier: ${seatIdentifier}`);
        return NextResponse.json({ error: `Invalid seat identifier format: ${seatIdentifier}` }, { status: 400 });
      }
    }

    return NextResponse.json({ bookedSeats }, { status: 201 });
  } catch (error) {
    console.error("Error during seat booking:", error); // Log the error to help debug
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}