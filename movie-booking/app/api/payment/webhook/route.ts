import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";  // Prisma Client

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia", 
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const rawBody = await req.arrayBuffer(); 
  const buffer = Buffer.from(rawBody);

  const sig = req.headers.get("stripe-signature")!;

  if (!buffer || !sig || !endpointSecret) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(buffer, sig, endpointSecret);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const paymentSuccessData = event.data.object;
      const sessionId = paymentSuccessData.id;
      const bookIdSu = paymentSuccessData.metadata!.bookId?.split(",") || [];

      // Handle successful payment
      try {
        await prisma.order.update({
          where: {
            session_id: sessionId,
          },
          data: {
            status: paymentSuccessData.status!,
          },
        });

        for (const bookId of bookIdSu) {
            await prisma.booking.update({
              where: {id: bookId},
              data: {
                status: "paid",
              },
          })
        }

      } catch (err) {
        console.error("Error updating order:", err);
      }
      break;

      case "checkout.session.expired":
        case "payment_intent.payment_failed":    
        const canceledData = event.data.object;
        const canceledSessionId = canceledData.id;
        const bookIds = canceledData.metadata!.bookId?.split(",") || [];

        try {
          await prisma.order.updateMany({
            where: { session_id: canceledSessionId, },
            data: {
              status: canceledData.status!,  
            },
          });


          for (const bookId of bookIds) {
              const bookings = await prisma.booking.findMany({
                where: {
                  id: { in: bookIds }, 
                },
                select: {
                  id: true,
                  seatId: true,
                },
              });
            
              const seatIds = bookings.map(booking => booking.seatId); 
            
              await prisma.seat.updateMany({
                where: {
                  id: { in: seatIds }, 
                },
                data: {
                  isAvailable: true, 
                },
              });
          
              console.log("Seats are now available again.");
          
              await prisma.booking.update({
                where: {id: bookId},
                data: {
                  status: "cancels",
                },
              })

              console.log(`Booking with ID ${bookId} is status cancels`);
            }
            

        } catch (err) {
          console.error("Error handling cancellation:", err);
        }
        break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse("Webhook received successfully", { status: 200 });
}