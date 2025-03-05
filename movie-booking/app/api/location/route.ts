import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ใช้ prisma client ที่ตั้งค่าไว้ในโฟลเดอร์ lib

// ✅ ดึงข้อมูล Location ทั้งหมด
export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      select: {
        id: true,
        name: true,
        address: true,
      },
    });

    return NextResponse.json(locations, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, address } = await req.json();

    if (!name || !address) {
      return NextResponse.json({ error: "Name and address are required" }, { status: 400 });
    }

    const newLocation = await prisma.location.create({
      data: { name, address },
    });

    return NextResponse.json(newLocation, { status: 201 });
  } catch (error) {
    console.error("Failed to create location:", error);
    return NextResponse.json({ error: "Failed to create location" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, address } = await req.json();

    if (!id || !name || !address) {
      return NextResponse.json({ error: "ID, Name, and Address are required" }, { status: 400 });
    }

    const updatedLocation = await prisma.location.update({
      where: { id },
      data: { name, address },
    });

    return NextResponse.json(updatedLocation, { status: 200 });
  } catch (error) {
    console.error("Failed to update location:", error);
    return NextResponse.json({ error: "Failed to update location" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.location.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Location deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete location:", error);
    return NextResponse.json({ error: "Failed to delete location" }, { status: 500 });
  }
}