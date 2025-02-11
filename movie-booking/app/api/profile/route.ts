import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken, SafeUser } from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        const user: SafeUser | null = await getUserFromToken(authHeader);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ user }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.message === "TokenExpired") {
            return NextResponse.json({ error: "Token has expired. Please log in again." }, { status: 401 });
        }
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        const user = await getUserFromToken(authHeader);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "No update fields provided" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                name: name || user.name,
            },
            select: {
                id: true,
                name: true,
            },
        });

        return NextResponse.json({ user: updatedUser, message: "Profile updated successfully" }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}