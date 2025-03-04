import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const protectedRoutes = ["/client/history", "/client/profile"];

  if (pathname.startsWith("/api/")) {
    const referer = req.headers.get("referer") || "";
    const userAgent = req.headers.get("user-agent") || "";

    // ✅ อนุญาตให้ API เรียกใช้งานจากโค้ด (เช่น fetch, axios)
    if (referer.includes("localhost:3000") || userAgent.includes("axios") || userAgent.includes("Postman")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/client/home", req.url));
  }

  if (protectedRoutes.includes(pathname)) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/client/auth/login", req.url));
    }

    console.log(" Middleware allowed access to booking-history");
  }

  return NextResponse.next(); 
}

// 🟢 กำหนดให้ Middleware ใช้กับเฉพาะบางเส้นทาง
export const config = {
  matcher: ["/client/history", "/client/profile", "/api/:path*"],
};