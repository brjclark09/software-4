import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GameplayService, GameDto } from '../../services/gameplay.service';

@Component({
  selector: 'app-game-view',
  imports: [FormsModule],
  templateUrl: './game-view.html'
})
export class GameView implements OnInit {
  game = signal<GameDto | null>(null);
  guess = '';
  errorMessage = '';

  constructor(private route: ActivatedRoute, private gameplayService: GameplayService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('gameId'));
    this.gameplayService.getGame(id).subscribe(game => this.game.set(game));
  }

  submitGuess(): void {
    const g = this.game();
    if (!g || !this.guess.trim()) return;

    const letter = this.guess.trim()[0].toLowerCase();
    this.errorMessage = '';
    this.guess = '';

    this.gameplayService.makeGuess(g.id, letter).subscribe({
      next: updated => this.game.set(updated),
      error: () => this.errorMessage = 'Could not submit guess.'
    });
  }

  spaced(str: string): string {
    return str.split('').join(' ');
  }
}
