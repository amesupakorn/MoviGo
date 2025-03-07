import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserFromToken } from "@/lib/auth"; 
import {prisma} from "@/lib/prisma";

export async function PUT(req: NextRequest) {
    try {
        const { oldPassword, newPassword } = await req.json();

        if (!oldPassword || !newPassword) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const userfetch = await getUserFromToken();
        
        const user = await prisma.user.findUnique({
            where: { id: userfetch?.id },
            select: {
                id: true,
                password: true,
            },
        });
        

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}