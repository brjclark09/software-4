import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-search',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  private movieService = inject(MovieService);
  private router = inject(Router);

  searchResults$ = this.movieService.searchResults$;
  loading$ = this.movieService.loading$;

  searchQuery = '';
  hasSearched = false;

  onSearch(): void {
    if (!this.searchQuery.trim()) return;
    this.hasSearched = true;
    this.movieService.searchMovies(this.searchQuery.trim()).subscribe();
  }

  onMovieClick(movie: Movie): void {
    this.movieService.setSelectedMovie(movie);
    this.router.navigate(['/movies', movie.id]);
  }
}
