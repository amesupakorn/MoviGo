import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { showtimeId: string } }) {
  const { showtimeId } = params;

  if (!showtimeId) {
    return NextResponse.json({ error: "showtimeId is required" }, { status: 400 });
  }

  try {
    const seats = await prisma.seat.findMany({
      where: {
        showtimeId: showtimeId,
      },
      include: {
        Booking: {
          where: {
            status: { in: ["reserved", "paid"] }, // ✅ กรองเฉพาะที่ยังจองอยู่
          },
          include: {
            user: true, // ✅ ดึงข้อมูลผู้จอง
          },
        },
      },
    });

    return NextResponse.json(seats, { status: 200 });
  } catch (error) {
    console.error("Error fetching seats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}