import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ใช้ prisma client ที่ตั้งค่าไว้ในโฟลเดอร์ lib

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
        select: {
          id: true,
          name: true,
          address: true,
        },
      });

    return NextResponse.json(locations , { status: 200 });
  } catch (error) {
    console.error("Failed to fetch location:", error);
    return NextResponse.json({ error: "Failed to fetch location" }, { status: 500 });
  }
}