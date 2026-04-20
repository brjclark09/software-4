import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameplayService, GameDto } from '../../services/gameplay.service';

@Component({
  selector: 'app-game-list',
  imports: [RouterLink],
  templateUrl: './game-list.html'
})
export class GameList implements OnInit {
  games = signal<GameDto[]>([]);

  constructor(private gameplayService: GameplayService) {}

  ngOnInit(): void {
    this.gameplayService.getAllGames().subscribe(games => this.games.set(games));
  }

  newGame(): void {
    this.gameplayService.createGame().subscribe(game => {
      this.games.update(games => [...games, game]);
    });
  }

  deleteGame(gameId: number): void {
    this.gameplayService.deleteGame(gameId).subscribe(remaining => this.games.set(remaining));
  }

  spaced(str: string): string {
    return str.split('').join(' ');
  }
}
