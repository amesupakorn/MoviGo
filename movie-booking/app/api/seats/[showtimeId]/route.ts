// pages/api/seats/[showtimeId].ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function GET(req: NextRequest, { params }: { params: { showtimeId: string } } 
) {

  const { showtimeId } = params;

  if (!showtimeId) {
    return NextResponse.json({ error: "showtimeId is required" }, { status: 400 });
  }

  try {
    const seats = await prisma.seat.findMany({
      where: {
        showtimeId: showtimeId, 
        isAvailable: false, 
      }
    });

    

    if (!seats || seats.length === 0) {
      return NextResponse.json({ message: "No available seats found" }, { status: 200 });
    }

    return NextResponse.json(seats, { status: 200 }); 
  } catch (error) {
    console.error("Error fetching seats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}