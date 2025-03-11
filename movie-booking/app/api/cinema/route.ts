import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Prisma Client

// ✅ GET - ดึงข้อมูล Cinema ทั้งหมด
export async function GET() {
  try {
    const cinemas = await prisma.cinema.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        locationId: true,
        location: {
          select: { name: true }, // แสดงชื่อ location ที่เกี่ยวข้อง
        },
      },
    });
    return NextResponse.json({ cinemas }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch cinemas:", error);
    return NextResponse.json({ error: "Failed to fetch cinemas" }, { status: 500 });
  }
}

//  POST - สร้าง Cinema ใหม่
export async function POST(req: Request) {
  try {
    const { name, type, locationId } = await req.json();
    
    if (!name || !type || !locationId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newCinema = await prisma.cinema.create({
      data: { name, type, locationId },
    });

    return NextResponse.json(newCinema, { status: 201 });
  } catch (error) {
    console.error("Failed to create cinema:", error);
    return NextResponse.json({ error: "Failed to create cinema" }, { status: 500 });
  }
}

//  PUT - แก้ไข Cinema ตาม ID
export async function PUT(req: Request) {
  try {
    const { id, name, type, locationId } = await req.json();

    if (!id || !name || !type || !locationId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedCinema = await prisma.cinema.update({
      where: { id },
      data: { name, type, locationId },
    });

    return NextResponse.json(updatedCinema, { status: 200 });
  } catch (error) {
    console.error("Error updating cinema:", error);
    return NextResponse.json({ error: "Failed to update cinema" }, { status: 500 });
  }
}

//  DELETE - ลบ Cinema ตาม ID
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json(); // รับ ID จาก body

    if (!id) {
      return NextResponse.json({ error: "Cinema ID is required" }, { status: 400 });
    }

    await prisma.cinema.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Cinema deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting cinema:", error);
    return NextResponse.json({ error: "Failed to delete cinema" }, { status: 500 });
  }
}