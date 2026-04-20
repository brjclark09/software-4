import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './components/home/home';
import { GameList } from './components/game-list/game-list';
import { GameView } from './components/game-view/game-view';
import { NotFound } from './components/not-found/not-found';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'auth/login', component: Login },
  { path: 'auth/register', component: Register },
  { path: 'game', component: GameList, canActivate: [authGuard] },
  { path: 'wordgame/:gameId', component: GameView, canActivate: [authGuard] },
  { path: '**', component: NotFound }
];
