export type GameState = 'idle' | 'playing' | 'gameOver';

export interface Password {
  readonly value: string;
  readonly pwnedCount: number | null;
  readonly roundsStayed: number;
}

export interface GameData {
  readonly leftPassword: Password;
  readonly rightPassword: Password;
  readonly score: number;
  readonly gameState: GameState;
}

export type GuessChoice = 'left' | 'right';

export interface GameResult {
  readonly score: number;
  readonly lastLeftPassword: string;
  readonly lastRightPassword: string;
  readonly correctAnswer: GuessChoice;
}
