import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ใช้ prisma client ที่ตั้งค่าไว้ในโฟลเดอร์ lib

export async function GET() {
  try {
    const cinemas = await prisma.cinema.findMany({
        select: {
          id: true,
          name: true,
          location: true,
        },
      });

    return NextResponse.json({ cinemas }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch cinemas:", error);
    return NextResponse.json({ error: "Failed to fetch cinemas" }, { status: 500 });
  }
}