import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movies',
  imports: [AsyncPipe],
  templateUrl: './movies.html',
  styleUrl: './movies.css',
})
export class Movies implements OnInit {
  private movieService = inject(MovieService);
  private router = inject(Router);

  movies$ = this.movieService.movies$;
  loading$ = this.movieService.loading$;

  ngOnInit(): void {
    this.movieService.getAllMovies().subscribe();
  }

  onMovieClick(movie: Movie): void {
    this.movieService.setSelectedMovie(movie);
    this.router.navigate(['/movies', movie.id]);
  }
}
