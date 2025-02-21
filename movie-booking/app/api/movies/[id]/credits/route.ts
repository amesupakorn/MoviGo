import { NextResponse } from "next/server";
import { fetchCreditMovies } from "@/lib/movies/detail";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const movieId = Number(params.id);
        if (!movieId) return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });

        const data = await fetchCreditMovies(movieId);
        return NextResponse.json(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch movie credit" }, { status: 500 });
    }
}