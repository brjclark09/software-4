import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { GameList } from './components/game-list/game-list';
import { GameView } from './components/game-view/game-view';
import { NotFound } from './components/not-found/not-found';
import { authGuard } from './auth/guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-module').then((m) => m.AuthModule),
  },
  { path: 'game', component: GameList, canActivate: [authGuard] },
  { path: 'wordgame/:gameId', component: GameView, canActivate: [authGuard] },
  { path: '**', component: NotFound }
];
