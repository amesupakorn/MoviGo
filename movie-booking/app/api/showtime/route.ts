/* eslint-disable prefer-const */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Prisma client for database
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { movieId, subCinemaId, startDate, endDate, times } = await req.json();

    if (!movieId || !subCinemaId || !startDate || !endDate || !times || times.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    //  Fetch Movie Details
    const movieResponse = await axios.get(`${process.env.HOST_URL}/api/movies/${movieId}`);
    const movieData = movieResponse.data;

    if (!movieData) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    console.log("🎬 Movie Details:", movieData);

    //  Ensure Movie Exists in Database
    let existingMovie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!existingMovie) {
      try {
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

    //  Ensure Cinema Exists
    const existingCinema = await prisma.cinema.findUnique({
      where: { id: subCinemaId },
    });

    if (!existingCinema) {
      return NextResponse.json({ error: "SubCinema not found" }, { status: 404 });
    }

    //  Generate Showtimes from Date Range
    const generatedShowtimes: { movieId: string; subCinemaId: string; date: Date; time: string }[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const formattedDate = currentDate.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format

      for (const time of times) {
        generatedShowtimes.push({
          movieId,
          subCinemaId,
          date: new Date(formattedDate),
          time,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log("📅 Generated Showtimes:", generatedShowtimes);

    //  Fetch Existing Showtimes for Same Cinema
    const existingShowtimes = await prisma.showtime.findMany({
      where: {
        subCinemaId,
        date: {
          gte: start,
          lte: end,
        },
        time: { in: times },
      },
      select: {
        date: true,
        time: true,
        movieId: true,
      },
    });

    const existingShowtimeSet = new Set(existingShowtimes.map(s => `${s.date.toISOString()}-${s.time}`));
    const differentMovieSet = new Set(existingShowtimes.filter(s => s.movieId !== movieId).map(s => s.time));

    //  Filter Out Duplicate and Conflicting Showtimes
    const filteredShowtimes = generatedShowtimes.filter(showtime => {
      const key = `${showtime.date.toISOString()}-${showtime.time}`;

      //  Prevent same time being used by a different movie
      if (differentMovieSet.has(showtime.time)) {
        console.warn(`⛔ Conflict: ${showtime.time} is already used by another movie in this cinema.`);
        return false;
      }

      return !existingShowtimeSet.has(key);
    });

    if (filteredShowtimes.length === 0) {
      return NextResponse.json({ error: "All selected showtimes already exist or conflict with other movies." }, { status: 400 });
    }

    console.log("🎟️ New Showtimes to Insert:", filteredShowtimes);

    //  Save Showtimes to Database
    const createdShowtimes = await prisma.showtime.createMany({
      data: filteredShowtimes,
      skipDuplicates: true,
    });

    console.log(" Successfully Created Showtimes:", createdShowtimes);

    return NextResponse.json({
      message: "Showtimes created successfully",
      createdCount: createdShowtimes.count,
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