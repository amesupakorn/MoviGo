import { NextResponse } from "next/server";

// WebSocket is not supported on Vercel serverless.
// Seat status is now handled via database polling through /api/seats/[showtimeId].
// This endpoint is kept as a no-op for backward compatibility.
export async function GET() {
  return NextResponse.json({ status: "ok", message: "Seat updates are handled via database polling." });
}