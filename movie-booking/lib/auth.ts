import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import {prisma} from "./prisma";
import { User } from "@prisma/client";

export type SafeUser = Omit<User, "password" | "createdAt">;

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET. Please define it in the .env file.");
}

/**
 * ดึงข้อมูล User จาก JWT Token และลบ `password`, `createdAt`
 * @param authHeader - Authorization Header (`Bearer token`)
 * @returns SafeUser | null
 */

export async function getUserFromToken(authHeader: string | null): Promise<SafeUser | null> {
    try {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.error("Unauthorized: Missing token");
            return null;
        }

        const token = authHeader.split(" ")[1];

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
        console.error("Error verifying token:", error);
        return null;
    }
}