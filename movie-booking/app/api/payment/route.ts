import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";  // Prisma Client
import { getUserFromToken } from "@/lib/auth"; // Helper function to get user from token

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia", 
});

export async function POST(req: NextRequest) {
  
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { selectedSeats }: { selectedSeats: string[] } = await req.json();

    const authHeader = req.headers.get("authorization");
    const user = await getUserFromToken(authHeader);

    if (!selectedSeats || !user) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const userId = user.id; // User ID from the token
    const premiumRows = ["A", "B", "C", "D", "E", "F"];

    const getSeatPrice = (seat: string) => {
      const row = seat[0]; // แถวที่นั่ง (ตัวอักษรแรกของที่นั่ง)
      return premiumRows.includes(row) ? 350 : 320; // ราคา premium หรือ standard
    };

    const orderId = uuidv4();
    let totalAmount = 0;
    const lineItems = selectedSeats.map((seat) => {
    const price = getSeatPrice(seat); 
      totalAmount += price
        return {
          price_data: {
            currency: "thb",
            product_data: {
              name: seat,  
            },
            unit_amount: price * 100, 
          },
          quantity: 1, 
        };
      });

    try {    
      // สร้าง session สำหรับการชำระเงิน
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems, 
        mode: "payment",
        success_url: `${process.env.HOST_URL}/payment/success/${orderId}`,  
        cancel_url: `${process.env.HOST_URL}/payment/cancel/${orderId}`, 
      });
  

      if (!user || !session || !session.status || !orderId || !session.id || !totalAmount ) {
        return NextResponse.json({ error: "Missing required fields"  }, { status: 400 });
      }

      await prisma.order.create({
        data: {
          order_id: orderId, 
          userId: userId,    
          status: session.status, 
          totalAmount: totalAmount,
          session_id: session.id,

        }
      });


      return NextResponse.json({ url: session.url }, { status: 200 });

    } catch (error) {
      console.error("Error creating session:", error);
      return NextResponse.json({ error: "Error creating payment session"  }, { status: 500 });
    }
  } 