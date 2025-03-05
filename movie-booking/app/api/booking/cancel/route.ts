import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Prisma client

export async function POST(req: NextRequest) {
  const { sessionId }: { sessionId: string } = await req.json();

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }

  try {
    // ค้นหา order ที่มี sessionId
    const order = await prisma.order.findFirst({
      where: { session_id: sessionId },
      include: { booking: { include: { seat: true } } }, // ดึงข้อมูล seat ด้วย
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const canceledSeats = []; // เก็บข้อมูลที่นั่งที่ถูกคืน

    for (const booking of order.booking) {
      // อัปเดต booking เป็น "canceled"
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "canceled" },
      });

      // คืนสถานะที่นั่งเป็น "available"
      await prisma.seat.update({
        where: { id: booking.seatId },
        data: { isAvailable: true },
      });

      // เก็บข้อมูลที่นั่งที่ถูกคืน
      canceledSeats.push({
        row: booking.seat.row,
        number: booking.seat.number,
      });

      console.log(`Booking ${booking.id} canceled, seat ${booking.seat.row}${booking.seat.number} available.`);
    }

    // อัปเดตคำสั่งซื้อเป็น "canceled"
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "canceled" },
    });

    return NextResponse.json({
      message: "Order and bookings canceled successfully",
      canceledSeats, 
    });
  } catch (error) {
    console.error("Error during booking cancellation:", error);
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
  }
}