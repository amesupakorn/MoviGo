import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Prisma client for database
import api from "@/lib/axios"; // Axios for external API calls

export async function POST(req: NextRequest) {
  try {
    const { movieId, subCinemaId, startDate, endDate, times } = await req.json();

    if (!movieId || !subCinemaId || !startDate || !endDate || !times || times.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Step 1: Fetch Movie Details
    const movieResponse = await api.get(`/movies/${movieId}`);
    const movieData = movieResponse.data;

    if (!movieData) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    console.log("🎬 Movie Details:", movieData);

    // ✅ Ensure Movie Exists in Database
    let existingMovie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!existingMovie) {
      try {
        // ✅ If movie is not in DB, insert it
        existingMovie = await prisma.movie.create({
          data: {
            id: movieId,
            title: movieData.title,
            duration: movieData.runtime || 120, // Default duration if not provided
            description: movieData.overview || "No description available",
            poster_path: movieData.poster_path || "",
          },
        });
        console.log("🎬 Movie added to database:", existingMovie);
      } catch (error) {
        console.error("❌ Error inserting movie:", error);
        return NextResponse.json({ error: "Failed to insert movie" }, { status: 500 });
      }
    }

    // ✅ Step 2: Ensure Cinema Exists
    const existingCinema = await prisma.cinema.findUnique({
      where: { id: subCinemaId },
    });

    if (!existingCinema) {
      return NextResponse.json({ error: "SubCinema not found" }, { status: 404 });
    }

    // ✅ Step 3: Generate Showtimes from Date Range
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const generatedShowtimes: { movieId: any; subCinemaId: any; date: Date; time: any; }[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    // eslint-disable-next-line prefer-const
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const formattedDate = currentDate.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format

      // ✅ Create showtimes for each selected time
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      times.forEach((time: any) => {
        generatedShowtimes.push({
          movieId,
          subCinemaId,
          date: new Date(formattedDate),
          time,
        });
      });

      // ✅ Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log("📅 Generated Showtimes:", generatedShowtimes);

    // ✅ Step 4: Save Showtimes to Database
    const createdShowtimes = await Promise.all(
      generatedShowtimes.map(async (showtime) => {
        return await prisma.showtime.create({
          data: showtime,
        });
      })
    );

    console.log("🎟️ Created Showtimes:", createdShowtimes);

    return NextResponse.json({
      message: "Showtimes created successfully",
      showtimes: createdShowtimes,
    });
  } catch (error) {
    console.error("❌ Unexpected Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}