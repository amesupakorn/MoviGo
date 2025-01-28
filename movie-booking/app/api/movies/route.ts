/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { fetchPopularMovies } from "../../../lib/tmdb";

export async function GET() {
  try {
    const data = await fetchPopularMovies();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}
