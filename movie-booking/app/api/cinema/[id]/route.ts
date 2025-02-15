import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } } 
) {
  try {
    const { id } = params;

    const cinema = await prisma.cinema.findUnique({
      where: { id },
      include: {
        showtimes: {
          select: {
            id: true,
            date: true,
            time: true,
            movie: {
              select: {
                id: true,
                title: true,
                duration: true,
              },
            },
          },
        },
      },
    });

    if (!cinema) {
      return NextResponse.json({ error: "Cinema not found" }, { status: 404 });
    }

    return NextResponse.json(cinema, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch cinema:", error);
    return NextResponse.json({ error: "Failed to fetch cinema" }, { status: 500 });
  }
}