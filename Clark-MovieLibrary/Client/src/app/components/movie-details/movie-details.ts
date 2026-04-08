import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-details',
  imports: [AsyncPipe],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private movieService = inject(MovieService);

  movie$ = this.movieService.selectedMovie$;
  loading$ = this.movieService.loading$;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('movieId'));
    this.movieService.getMovieById(id).subscribe();
  }

  goBack(): void {
    this.router.navigate(['/movies']);
  }
}
