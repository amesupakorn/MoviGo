import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import { writeFile, unlink } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const user = await getUserFromToken();


        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as Blob | null;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // ✅ ดึงชื่อไฟล์เก่าจากฐานข้อมูล
        const existingUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { profileImage: true },
        });

        const filename = `${user.id}.jpg`; // ใช้ ID ของ User เป็นชื่อไฟล์เสมอ
        const filePath = path.join(process.cwd(), "public/profileImage", filename);

        // ✅ ถ้ามีรูปเดิมอยู่แล้ว → ลบไฟล์เดิมก่อน
        if (existingUser?.profileImage) {
            try {
                await unlink(filePath);
            } catch (error) {
                console.error("Error deleting old image:", error);
            }
        }

        await writeFile(filePath, buffer);

        const imageUrl = `/profileImage/${filename}`;

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { profileImage: imageUrl },
            select: { id: true, profileImage: true },
        });

        return NextResponse.json({ user: updatedUser, message: "Profile picture updated" }, { status: 200 });
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }
}