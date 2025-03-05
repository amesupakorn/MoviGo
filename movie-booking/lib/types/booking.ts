import { Movie } from "@/lib/types/movie";
import { User } from "@/lib/types/user";

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
  location: Location;
  showtimes: Showtime[]; 
}

export interface Showtime {
  id: string;
  movie: Movie;
  subCinema: Cinema;
  date: Date;
  time: string;
  seat: Seat[];
}
export interface Seat {
  id: string;            
  row: string;           
  number: number;       
  price: number;      
  showtimeId: string;  
  isAvailable: boolean;  
}

export interface Booking {
  id: string;
  showtime: Showtime; 
  user: User;         
  seat: Seat;        
  status: string;     
  createdAt: Date;    
}

export interface Order {
  id: string;
  order_id: string;
  user: User;
  booking: Booking[];
  status: string;
  totalAmount: number;
  session_id: string;

}