export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    release_date: string;
}

export interface MovieBannerProps {
    movies: Movie[];
}

export interface MovieResponse {
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export interface MovieDetail {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    release_date: string;
    genres: { id: number; name: string }[];
    runtime: number;
    vote_average: number;
    tagline: string;
    posters: string;
}


export interface Review {
    id: string;
    author: string;
    content: string;
    url: string;
}
export interface MovieImage {
    file_path: string;
    width: number;
    height: number;
}

export interface MovieVideo {
    id: string;
    key: string;
    site: string;
    type: string;
}