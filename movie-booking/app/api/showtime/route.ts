import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Prisma client for database
import api from "@/lib/axios"; // Axios for external API calls
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { movieId, subCinemaId, startDate, endDate, times } = await req.json();

    if (!movieId || !subCinemaId || !startDate || !endDate || !times || times.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Step 1: Fetch Movie Details
    const movieResponse = await axios.get(`${process.env.HOST_URL}/api/movies/${movieId}`);
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
        // ✅ Insert movie if it does not exist
        existingMovie = await prisma.movie.create({
          data: {
            id: movieId,
            title: movieData.title,
            duration: movieData.runtime || 120,
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
    const generatedShowtimes: { movieId: string; subCinemaId: string; date: Date; time: string }[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    // eslint-disable-next-line prefer-const
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const formattedDate = currentDate.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format

      // ✅ Create showtimes for each selected time
      for (const time of times) {
        generatedShowtimes.push({
          movieId,
          subCinemaId,
          date: new Date(formattedDate),
          time,
        });
      }

      // ✅ Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log("📅 Generated Showtimes:", generatedShowtimes);

    // ✅ Step 4: Filter Out Existing Showtimes to Prevent Duplicates
    const existingShowtimes = await prisma.showtime.findMany({
      where: {
        movieId,
        subCinemaId,
        date: {
          gte: start,
          lte: end,
        },
        time: { in: times },
      },
    });

    const existingShowtimeSet = new Set(existingShowtimes.map(s => `${s.date.toISOString()}-${s.time}`));

    const filteredShowtimes = generatedShowtimes.filter(showtime => {
      const key = `${showtime.date.toISOString()}-${showtime.time}`;
      return !existingShowtimeSet.has(key);
    });

    if (filteredShowtimes.length === 0) {
      return NextResponse.json({ error: "All selected showtimes already exist." }, { status: 400 });
    }

    console.log("🎟️ New Showtimes to Insert:", filteredShowtimes);

    // ✅ Step 5: Save Non-Duplicate Showtimes to Database
    const createdShowtimes = await prisma.showtime.createMany({
      data: filteredShowtimes,
      skipDuplicates: true, // ✅ This prevents accidental duplicate insertion
    });

    console.log("✅ Successfully Created Showtimes:", createdShowtimes);

    return NextResponse.json({
      message: "Showtimes created successfully",
      showtimes: createdShowtimes,
    
    });
  } catch (error) {
    console.error("❌ Unexpected Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
    try {
      const { id } = await req.json();
  
      if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
      }
  
      await prisma.showtime.delete({
        where: { id },
      });
  
      return NextResponse.json({ message: "showtime deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Failed to delete showtime:", error);
      return NextResponse.json({ error: "Failed to delete showtime" }, { status: 500 });
    }
  }