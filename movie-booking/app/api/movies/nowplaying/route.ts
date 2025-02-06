import { NextResponse } from "next/server";
import { fetchNowPlayingMovies } from "@/lib/movies/nowplaying";

export async function GET() {
  try {
    const data = await fetchNowPlayingMovies();
    return NextResponse.json(data);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch now playing movies" }, { status: 500 });
  }
}