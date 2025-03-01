import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const location = await prisma.location.findUnique({
      where: { id },
      include: {
        subCinemas: {
          select: {
            id: true,
            name: true,
            type: true,
            showtimes: {
              orderBy: {
                time: 'asc', 
              },
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
        },
      },
    });

    if (!location) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    return NextResponse.json(location, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch location:", error);
    return NextResponse.json({ error: "Failed to fetch location" }, { status: 500 });
  }
}