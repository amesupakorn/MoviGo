import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { Booking } from "@/lib/types/booking";
import { User } from "@/lib/types/user";
import { getBaseUrl } from "@/lib/api-url";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function createPaymentSession(selectedSeats: string[], bookedSeats: Booking[], showtimeId: string, user: User) {
  const userId = user.id;
  const premiumRows = ["A", "B", "C", "D", "E", "F"];
  
  const getSeatPrice = (seat: string) => {
    const row = seat[0];
    return premiumRows.includes(row) ? 350 : 320;
  };

  const orderId = uuidv4();
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

  // Create Stripe payment session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${getBaseUrl()}/payment/success/${orderId}`,
    cancel_url: `${getBaseUrl()}/client/showtime/${showtimeId}`,
    metadata: {
      bookId: bookedSeats.map((booking) => booking.id).join(","),
    },
  });

  if (!session || !session.id) {
    throw new Error("Failed to create Stripe session");
  }

  // Create order in the database
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

  return { url: session.url, session: session.id };
}
