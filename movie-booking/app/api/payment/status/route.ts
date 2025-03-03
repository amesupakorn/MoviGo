// src/app/api/payment/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("cookie");

    if (!sessionId) {
      return NextResponse.json({ message: "Session ID is required" }, { status: 200 });
    }

    const order = await prisma.order.findUnique({
      where: {
        session_id: sessionId,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ status: order.status }); // Send back order status (e.g. 'complete', 'pending')
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return NextResponse.json({ error: "Failed to fetch payment status" }, { status: 500 });
  }
}