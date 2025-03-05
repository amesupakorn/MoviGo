import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { prisma } from "./prisma";
import { User } from "@prisma/client";
import { cookies } from "next/headers";

export type SafeUser = Omit<User, "password" | "createdAt">;

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET. Please define it in the .env file.");
}

/**
 * ดึงข้อมูล User จาก JWT Token ที่อยู่ใน Cookies และลบ `password`, `createdAt`
 * @returns SafeUser | null
 */
export async function getUserFromToken(): Promise<SafeUser | null> {
    try {
        const cookieStore = await cookies(); 
        const token = cookieStore.get("token")?.value; 
        
        if (!token) {
            console.error("Unauthorized: Missing token in cookies");
            return null;
        }

        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                console.error("JWT Token Expired");
                throw new Error("TokenExpired");
            }
            console.error("Invalid Token:", error);
            return null;
        }

        if (!decoded.id) {
            console.error("Invalid token payload");
            return null;
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                profileImage: true, 
            },
        });

        if (!user) {
            console.error("User not found in database");
            return null;
        }

        return user;
    } catch (error) {
        console.error("Error verifying token from cookies:", error);
        return null;
    }
}