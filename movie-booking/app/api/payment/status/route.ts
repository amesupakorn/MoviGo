// src/app/api/payment/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";


export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("cookie");

    if (!sessionId) {
      return NextResponse.json({ message: "Session ID is required" }, { status: 200 });
    }

    let order = await prisma.order.findUnique({
      where: {
        session_id: sessionId,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If status is not complete, check Stripe to be sure
    if (order.status !== "complete") {
      try {
        const session = await stripe.checkout.sessions.retrieve(order.session_id);
        if (session.status === "complete") {
          order = await prisma.order.update({
            where: { id: order.id },
            data: { status: "complete" },
          });

          // Also update bookings status if they were not updated by webhook yet
          await prisma.booking.updateMany({
            where: { orderId: order.id },
            data: { status: "paid" },
          });
        }
      } catch (stripeError) {
        console.error("Error retrieving Stripe session in status check:", stripeError);
      }
    }

    return NextResponse.json({ status: order.status });

  } catch (error) {
    console.error("Error fetching payment status:", error);
    return NextResponse.json({ error: "Failed to fetch payment status" }, { status: 500 });
  }
}