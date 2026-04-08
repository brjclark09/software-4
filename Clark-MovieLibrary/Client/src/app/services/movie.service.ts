import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly apiUrl = 'http://localhost:5000/api/movies';

  private moviesSubject = new BehaviorSubject<Movie[]>([]);
  movies$ = this.moviesSubject.asObservable();

  private selectedMovieSubject = new BehaviorSubject<Movie | null>(null);
  selectedMovie$ = this.selectedMovieSubject.asObservable();

  private searchResultsSubject = new BehaviorSubject<Movie[]>([]);
  searchResults$ = this.searchResultsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllMovies(): Observable<Movie[]> {
    this.loadingSubject.next(true);
    return this.http.get<Movie[]>(this.apiUrl).pipe(
      tap({
        next: (movies) => {
          this.moviesSubject.next(movies);
          this.loadingSubject.next(false);
        },
        error: () => this.loadingSubject.next(false)
      })
    );
  }

  getMovieById(movieId: number): Observable<Movie> {
    this.loadingSubject.next(true);
    return this.http.get<Movie>(`${this.apiUrl}/${movieId}`).pipe(
      tap({
        next: (movie) => {
          this.selectedMovieSubject.next(movie);
          this.loadingSubject.next(false);
        },
        error: () => this.loadingSubject.next(false)
      })
    );
  }

  searchMovies(title: string): Observable<Movie[]> {
    this.loadingSubject.next(true);
    const params = new HttpParams().set('title', title);
    return this.http.get<Movie[]>(`${this.apiUrl}/search`, { params }).pipe(
      tap({
        next: (movies) => {
          this.searchResultsSubject.next(movies);
          this.loadingSubject.next(false);
        },
        error: () => this.loadingSubject.next(false)
      })
    );
  }

  setSelectedMovie(movie: Movie | null): void {
    this.selectedMovieSubject.next(movie);
  }

  clearSearchResults(): void {
    this.searchResultsSubject.next([]);
  }
}
