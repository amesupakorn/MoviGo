import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Prisma client
import { getUserFromToken } from "@/lib/auth"; // Helper function to get user from token
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { selectedSeats, showtimeId, status }: { selectedSeats: string[], showtimeId: string, status: string } = await req.json();
    
    const user = await getUserFromToken();
    const cookieStore = await cookies(); 
    const token = cookieStore.get("token")?.value; 
    
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
        user,
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

export async function GET() {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ดึงข้อมูลประวัติการจองจากตาราง Order
    const orders = await prisma.order.findMany({
      where: { 
        userId: user.id,
        status: "complete"
      },
      include: {
        booking: {
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
            seat: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ orders: orders }, { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}