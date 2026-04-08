import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Movies } from './components/movies/movies';
import { MovieDetails } from './components/movie-details/movie-details';
import { Search } from './components/search/search';
import { NotFound } from './components/not-found/not-found';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'movies', component: Movies },
  { path: 'movies/search', component: Search },
  { path: 'movies/:movieId', component: MovieDetails },
  { path: '**', component: NotFound }
];
