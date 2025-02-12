import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } } 
) {
  try {
    const { id } = params;

    const cinema = await prisma.showtime.findUnique({
      where: { id },
      include: {
        seats: {
          select: {
            id: true,
            row: true,
            number: true,
            isAvailable: true
          },
        },
      },
    });

    if (!cinema) {
      return NextResponse.json({ error: "showtime not found" }, { status: 404 });
    }

    return NextResponse.json(cinema, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch showtime:", error);
    return NextResponse.json({ error: "Failed to fetch showtime" }, { status: 500 });
  }
}