import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    let order = await prisma.order.findUnique({
      where: { order_id:  orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If status is not complete, check Stripe to be sure (handles race condition with webhook)
    if (order.status !== "complete") {
      try {
        const session = await stripe.checkout.sessions.retrieve(order.session_id);
        if (session.status === "complete") {
          // Update order status in DB
          order = await prisma.order.update({
            where: { id: order.id },
            data: { status: "complete" },
          });

          // Also update bookings status if they were not updated by webhook yet
          const bookings = await prisma.booking.findMany({
            where: { orderId: order.id },
          });
          
          if (bookings.some(b => b.status !== "paid")) {
             await prisma.booking.updateMany({
               where: { orderId: order.id },
               data: { status: "paid" },
             });
          }
        }
      } catch (stripeError) {
        console.error("Error retrieving Stripe session:", stripeError);
      }
    }

    return NextResponse.json(order, { status: 200 });

  } catch (error) {
    console.error("Failed to fetch Order:", error);
    return NextResponse.json({ error: "Failed to fetch Order" }, { status: 500 });
  }
}