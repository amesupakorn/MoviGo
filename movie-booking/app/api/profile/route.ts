import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: NextRequest) {

    try {
        const authHeader = req.headers.get("authorization");
        const user = await getUserFromToken(authHeader);


        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ user }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        if (error.message === "TokenExpired") {
            return NextResponse.json({ error: "Token has expired. Please log in again." }, { status: 401 });
        }
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}