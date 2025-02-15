import { Movie } from "@/lib/types/movie";

export interface Location {
  id: string;
  name: string;
  address: string;
  subCinemas: Cinema[]; 
}

export interface Cinema {
  id: string;
  name: string;
  type: string;
  showtimes: Showtime[]; 
}

export interface Showtime {
  id: string;
  movie: Movie; 
  date: Date;
  time: string;
}