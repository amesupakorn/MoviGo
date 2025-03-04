export interface MovieSearchResult {
    id: number;
    poster_path: string | null;
    title: string;
  }
  
  export interface MovieSearchResponse {
    page: number;
    results: MovieSearchResult[];
  }
  