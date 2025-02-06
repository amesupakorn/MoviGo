import { NextResponse } from "next/server";
import { fetchPopularMovies } from "@/lib/movies/popular";

export async function GET() {
  try {
    const data = await fetchPopularMovies();
    return NextResponse.json(data);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch popular movies" }, { status: 500 });
  }
}