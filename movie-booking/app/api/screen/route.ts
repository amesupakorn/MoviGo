import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const screenings = await prisma.screening.findMany({
        include: {
            movie: true,
            cinema: true,
          },
        });
    

    if (!screenings || screenings.length === 0) {
      return NextResponse.json({ error: "No screenings found" }, { status: 404 });
    }

    return NextResponse.json(screenings, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch screenings:", error);
    return NextResponse.json({ error: "Failed to fetch screenings" }, { status: 500 });
  }
}