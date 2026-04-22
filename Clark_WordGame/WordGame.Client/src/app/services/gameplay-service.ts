import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GameDto {
  id: number;
  userId: string;
  status: string;
  guesses: string;
  view: string;
  remainingGuesses: number;
  answer: string | null;
}

@Injectable({ providedIn: 'root' })
export class GameplayService {
  private readonly baseUrl = '/api/gameplay';

  constructor(private http: HttpClient) {}

  getAllGames(): Observable<GameDto[]> {
    return this.http.get<GameDto[]>(`${this.baseUrl}/games`);
  }

  getGame(gameId: number): Observable<GameDto> {
    return this.http.get<GameDto>(`${this.baseUrl}/games/${gameId}`);
  }

  createGame(): Observable<GameDto> {
    return this.http.post<GameDto>(`${this.baseUrl}/games`, {});
  }

  deleteGame(gameId: number): Observable<GameDto[]> {
    return this.http.delete<GameDto[]>(`${this.baseUrl}/games/${gameId}`);
  }

  makeGuess(gameId: number, guess: string): Observable<GameDto> {
    return this.http.post<GameDto>(`${this.baseUrl}/games/${gameId}/guesses?guess=${guess}`, {});
  }
}
