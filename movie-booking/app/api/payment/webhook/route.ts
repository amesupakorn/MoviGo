import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";  // Prisma Client

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia", 
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  // Read the raw body and verify the Stripe signature
  const rawBody = await req.arrayBuffer(); 
  const buffer = Buffer.from(rawBody) 

  const sig = req.headers.get("stripe-signature")!;

  if (!buffer|| !sig || !endpointSecret) {
    return NextResponse.json({ error: "Missing required fields"  }, { status: 400 });
  }  let event;

  try {

    event = stripe.webhooks.constructEvent(buffer, sig, endpointSecret);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err : any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const paymentSuccessData = event.data.object;
      const sessionId = paymentSuccessData.id;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const data = {
        status: paymentSuccessData.status,
      };

      // Update the order status in the database
      try {
        const order = await prisma.order.update({
            where: {
              id: (await prisma.order.findFirst({
                where: {
                  session_id: sessionId,
                },
              }))?.id, // Getting the id from `session_id`
            },
            data: {
              status: paymentSuccessData.status!,
            },
          });

        console.log("Order updated:", order);
      } catch (err) {
        console.error("Error updating order:", err);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse("Webhook received successfully", { status: 200 });
}