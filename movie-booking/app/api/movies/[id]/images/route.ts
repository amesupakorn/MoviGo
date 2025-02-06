import { NextResponse } from "next/server";
import { fetchMovieImages } from "@/lib/movies/detail";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const movieId = Number(params.id);
        if (!movieId) return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });

        const data = await fetchMovieImages(movieId);
        return NextResponse.json(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch movie images" }, { status: 500 });
    }
}