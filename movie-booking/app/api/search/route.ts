import { NextResponse } from "next/server";
import { fetchSearchMovies } from "@/lib/movies/search";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const page = parseInt(searchParams.get("page") || "1", 10);

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    const movies = await fetchSearchMovies(query, page);

    return NextResponse.json(movies);
  } catch (error) {
    console.error("Error fetching search results:", error);
    return NextResponse.json({ error: "Failed to fetch movie search results" }, { status: 500 });
  }
}
