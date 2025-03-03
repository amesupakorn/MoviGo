import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Prisma client

export async function POST(req: NextRequest) {
  const { sessionId }: { sessionId: string } = await req.json(); // รับ sessionId จาก request

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }

  try {
    // ค้นหา order ที่มี sessionId ตรงกับที่ส่งมา
    const order = await prisma.order.findFirst({
      where: {
        session_id: sessionId,
      },
      include: {
        booking: true, 
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // วนลูปการจองทั้งหมดในคำสั่งซื้อ
    const bookIds = order.booking.map((booking) => booking.id);

    for (const bookId of bookIds) {
    
      const booking = await prisma.booking.update({
        where: { id: bookId },
        data: {
          status: "canceled", 
        },
      });

      // คืนที่นั่งที่จองไว้ให้กลับมาเป็น "ว่าง"
      await prisma.seat.update({
        where: { id: booking.seatId },
        data: {
          isAvailable: true, 
        },
      });

      console.log(`Booking with ID ${bookId} is now canceled, and seat is available again.`);
    }

    // อัปเดตสถานะคำสั่งซื้อให้เป็น "canceled"
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "canceled", // เปลี่ยนสถานะคำสั่งซื้อเป็น canceled
      },
    });

    return NextResponse.json({ message: "Order and booking canceled successfully" });
  } catch (error) {
    console.error("Error during booking cancellation:", error);
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
  }
}

