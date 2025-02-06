export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    release_date: string;
}

export interface MovieResponse {
    results: Movie[];
    total_pages: number;
    total_results: number;
}