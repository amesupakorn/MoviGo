import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const protectedRoutes = ["/history", "/profile"];

  if (pathname.startsWith("/api/")) {
    return NextResponse.redirect(new URL("/client/home", req.url));
  }

  if (protectedRoutes.includes(pathname)) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/client/auth/login", req.url));
    }

    console.log("✅ Middleware allowed access to booking-history");
  }

  return NextResponse.next(); 
}

// 🟢 กำหนดให้ Middleware ใช้กับเฉพาะบางเส้นทาง
export const config = {
  matcher: ["/history", "/profile", "/api/:path*"],
};