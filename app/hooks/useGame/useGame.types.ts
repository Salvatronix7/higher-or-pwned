import type { GameResult, GameState, GuessChoice, Password } from '~/types';

export interface UseGameReturn {
  readonly leftPassword: Password;
  readonly rightPassword: Password;
  readonly score: number;
  readonly gameState: GameState;
  readonly isLoading: boolean;
  readonly gameResult: GameResult | null;
  readonly timeRemaining: number;
  readonly countdownValue: number;
  readonly makeGuess: (choice: GuessChoice) => void;
  readonly startReveal: () => boolean;
  readonly resetGame: () => void;
}
