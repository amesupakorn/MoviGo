import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Prisma client
import { getUserFromToken, SafeUser } from "@/lib/auth"; // Helper function to get user from token
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { selectedSeats, showtimeId, status }: { selectedSeats: string[], showtimeId: string, status: string } = await req.json();
    
    // Get user info from the request header
    const authHeader = req.headers.get("authorization");
    const user = await getUserFromToken(authHeader);
    const token = authHeader!.split(" ")[1];  

    
    if (!selectedSeats || !showtimeId || !user || !user.id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = user.id; // User ID from the token
    const bookedSeats = [];
    const premiumRows = ["A", "B", "C", "D", "E", "F"];


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


      const paymentResponse = await axios.post(`${process.env.HOST_URL}/api/payment`, {
        selectedSeats,   
        bookedSeats,
        showtimeId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });


    if (paymentResponse?.data?.url) {
      return NextResponse.json({ url: paymentResponse.data.url, session: paymentResponse.data.session }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Payment session creation failed' }, { status: 500 });
    }
  
  } catch (error) {
    console.error("Error during seat booking:", error); // Log the error to help debug
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
        const user: SafeUser | null = await getUserFromToken(authHeader);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

    // ดึงข้อมูลการจองทั้งหมด
    const bookings = await prisma.booking.findMany({
      where: {userId : user.id},
      include: {
        showtime: {
          include: {
            movie: true,
            subCinema: {
              include: {
                location: true,
              },
            },
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
        seat: true,
        order: true,
      },
    });

    return NextResponse.json({ success: true, booking: bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}