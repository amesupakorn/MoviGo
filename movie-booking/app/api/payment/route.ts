import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";  // Prisma Client
import { getUserFromToken } from "@/lib/auth"; // Helper function to get user from token
import { Booking } from "@/lib/types/booking"
import { console } from "inspector";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia", 
});

export async function POST(req: NextRequest) {
  const { selectedSeats, bookedSeats, showtimeId }: { selectedSeats: string[], bookedSeats: Booking[], showtimeId: string } = await req.json();

  const authHeader = req.headers.get("authorization");
  const user = await getUserFromToken(authHeader);


  if (!selectedSeats || !user || !bookedSeats) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const userId = user.id;
  const premiumRows = ["A", "B", "C", "D", "E", "F"];
  
  const getSeatPrice = (seat: string) => {
    const row = seat[0]; // Get the row from seat identifier (like "A8")
    return premiumRows.includes(row) ? 350 : 320;
  };

  const orderId= uuidv4();
  let totalAmount = 0;

  const lineItems = selectedSeats.map((seat) => {
    const price = getSeatPrice(seat);
    totalAmount += price;

    return {
      price_data: {
        currency: "thb",
        product_data: {
          name: `ticket ${seat}`,
        },
        unit_amount: price * 100, 
      },
      quantity: 1,
    };
  });

  try {
    // Create Stripe payment session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.HOST_URL}/payment/success/${orderId}`,
      cancel_url: `${process.env.HOST_URL}/client/showtime/${showtimeId}`,
      metadata: {
        bookId: bookedSeats.map((booking) => booking.id).join(","),
      },
    });

    if (!session || !session.id) {
      return NextResponse.json({ error: "Failed to create Stripe session" }, { status: 500 });
    }
    // Update order in the database
    const order = await prisma.order.create({
      data: {
        order_id: orderId,
        userId: userId,
        status: session.status!,
        totalAmount: totalAmount,
        session_id: session.id,
      },
    });

    const bookIds = bookedSeats.map((booking) => booking.id);

    await prisma.booking.updateMany({
      where: {
        id: { in: bookIds },
      },
      data: {
        orderId: order.id,
      },
    });


    return NextResponse.json({ url: session.url, session: session.id }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating payment session:", error);
    return NextResponse.json({ error: "Error creating payment session" }, { status: 500 });
  }
}