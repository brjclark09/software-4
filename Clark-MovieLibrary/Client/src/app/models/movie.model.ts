export interface Movie {
  id: number;
  title: string;
  director: string;
  genre: string;
  releaseYear: number;
  rating: number;
  isAvailableToStream: boolean;
  description: string;
  posterPath: string;
}
