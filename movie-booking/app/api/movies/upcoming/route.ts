import { NextResponse } from "next/server";
import { fetchUpcomingMovies } from "@/lib/movies/upcoming";

export async function GET() {
  try {
    const data = await fetchUpcomingMovies();
    return NextResponse.json(data);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch upcoming movies" }, { status: 500 });
  }
}