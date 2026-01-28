import { useCallback, useState, useMemo } from 'react';
import { usePwnedCount } from '~/queries';
import { getRandomPassword } from '~/utils';
import { MAX_ROUNDS_STAYED } from '~/constants';
import type { GameState, Password, GuessChoice, GameResult } from '~/types';

interface UseGameReturn {
  readonly leftPassword: Password;
  readonly rightPassword: Password;
  readonly score: number;
  readonly gameState: GameState;
  readonly isLoading: boolean;
  readonly gameResult: GameResult | null;
  readonly makeGuess: (choice: GuessChoice) => void;
  readonly resetGame: () => void;
}

const createInitialPassword = (exclude: readonly string[] = []): Password => ({
  value: getRandomPassword(exclude),
  pwnedCount: null,
  roundsStayed: 0,
});

export const useGame = (): UseGameReturn => {
  const [leftPassword, setLeftPassword] = useState<Password>(() =>
    createInitialPassword()
  );
  const [rightPassword, setRightPassword] = useState<Password>(() =>
    createInitialPassword([leftPassword.value])
  );
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const leftQuery = usePwnedCount(leftPassword.value);
  const rightQuery = usePwnedCount(rightPassword.value);

  const isLoading = leftQuery.isLoading || rightQuery.isLoading;

  const leftWithCount: Password = useMemo(
    () => ({
      ...leftPassword,
      pwnedCount: leftQuery.data ?? null,
    }),
    [leftPassword, leftQuery.data]
  );

  const rightWithCount: Password = useMemo(
    () => ({
      ...rightPassword,
      pwnedCount: rightQuery.data ?? null,
    }),
    [rightPassword, rightQuery.data]
  );

  const makeGuess = useCallback(
    (choice: GuessChoice) => {
      if (isLoading || gameState !== 'playing') return;

      const leftCount = leftQuery.data ?? 0;
      const rightCount = rightQuery.data ?? 0;

      const correctChoice: GuessChoice =
        leftCount >= rightCount ? 'left' : 'right';
      const isCorrect = choice === correctChoice;

      if (!isCorrect) {
        setGameState('gameOver');
        setGameResult({
          score,
          lastLeftPassword: leftPassword.value,
          lastRightPassword: rightPassword.value,
          correctAnswer: correctChoice,
        });
        return;
      }

      const newScore = score + 1;
      setScore(newScore);

      const winner = choice === 'left' ? leftPassword : rightPassword;
      const winnerCount = choice === 'left' ? leftCount : rightCount;
      const newRoundsStayed = winner.roundsStayed + 1;

      if (newRoundsStayed > MAX_ROUNDS_STAYED) {
        const newLeft = createInitialPassword();
        const newRight = createInitialPassword([newLeft.value]);
        setLeftPassword(newLeft);
        setRightPassword(newRight);
      } else {
        const updatedWinner: Password = {
          value: winner.value,
          pwnedCount: winnerCount,
          roundsStayed: newRoundsStayed,
        };

        const existingPasswords = [leftPassword.value, rightPassword.value];
        const newChallenger = createInitialPassword(existingPasswords);

        if (choice === 'left') {
          setLeftPassword(updatedWinner);
          setRightPassword(newChallenger);
        } else {
          setLeftPassword(newChallenger);
          setRightPassword(updatedWinner);
        }
      }
    },
    [
      isLoading,
      gameState,
      leftQuery.data,
      rightQuery.data,
      leftPassword,
      rightPassword,
      score,
    ]
  );

  const resetGame = useCallback(() => {
    const newLeft = createInitialPassword();
    const newRight = createInitialPassword([newLeft.value]);
    setLeftPassword(newLeft);
    setRightPassword(newRight);
    setScore(0);
    setGameState('playing');
    setGameResult(null);
  }, []);

  return {
    leftPassword: leftWithCount,
    rightPassword: rightWithCount,
    score,
    gameState,
    isLoading,
    gameResult,
    makeGuess,
    resetGame,
  };
};
