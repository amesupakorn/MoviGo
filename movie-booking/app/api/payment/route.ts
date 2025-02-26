import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";  // Prisma Client

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia", 
});


interface User {
  name: string,
  address: string
}

interface Product {
  name: string
  price: number
  quantity: number
}
export async function POST(req: NextRequest) {
  
      const { product, user }: { product: Product; user: User; } = await req.json();

    // const authHeader = req.headers.get("authorization");
    // const user = await getUserFromToken(authHeader);

    if (!user|| !product) {
      return NextResponse.json({ error: "Missing required fields"  }, { status: 400 });
    }

    try {
      // สร้าง session สำหรับการชำระเงิน
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const orderId = uuidv4();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "thb",
              product_data: {
                name: product.name,
              },
              unit_amount: product.price * 100, 
            },
            quantity: product.quantity,
          },
        ],
        mode: "payment",
        success_url: `http://localhost:3000/success.html?id=${orderId}`, 
        cancel_url: `http://localhost:3000/cancel.html?id=${orderId}`,  
      });

      const userId= "1fa16313-30c3-4211-b69b-da9c84996514"

      if (!user || !session || !session.status || !orderId) {
        return NextResponse.json({ error: "Missing required fields"  }, { status: 400 });
      }

      const order = await prisma.order.create({
        data: {
          order_id: orderId, 
          userId: userId,    
          status: session.status, 
          totalAmount: product.price * product.quantity,
          session_id: session.id, 
        },

      

      })


      console.log("session", session)
      return NextResponse.json({ session: session }, { status: 200 });



    } catch (error) {
      console.error("Error creating session:", error);
      return NextResponse.json({ error: "Error creating payment session"  }, { status: 500 });
    }
  } 