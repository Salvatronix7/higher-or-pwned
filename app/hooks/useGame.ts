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
  readonly startReveal: () => boolean;
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
  const [usedPasswords, setUsedPasswords] = useState<Set<string>>(
    () => new Set([leftPassword.value, rightPassword.value])
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

  const startReveal = useCallback(() => {
    if (isLoading || gameState !== 'playing') {
      return false;
    }
    setGameState('revealing');
    return true;
  }, [gameState, isLoading]);

  const makeGuess = useCallback(
    (choice: GuessChoice) => {
      if (isLoading || gameState === 'gameOver') return;

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

      setGameState('playing');
      const newScore = score + 1;
      setScore(newScore);

      const updatedUsed = new Set(usedPasswords);
      updatedUsed.add(leftPassword.value);
      updatedUsed.add(rightPassword.value);

      const winner = choice === 'left' ? leftPassword : rightPassword;
      const winnerCount = choice === 'left' ? leftCount : rightCount;
      const newRoundsStayed = winner.roundsStayed + 1;

      if (newRoundsStayed > MAX_ROUNDS_STAYED) {
        const newLeft = createInitialPassword([...updatedUsed]);
        const newRight = createInitialPassword([...updatedUsed, newLeft.value]);
        updatedUsed.add(newLeft.value);
        updatedUsed.add(newRight.value);
        setLeftPassword(newLeft);
        setRightPassword(newRight);
        setUsedPasswords(updatedUsed);
        return;
      }

      const updatedWinner: Password = {
        value: winner.value,
        pwnedCount: winnerCount,
        roundsStayed: newRoundsStayed,
      };

      const newChallenger = createInitialPassword([
        ...updatedUsed,
        updatedWinner.value,
      ]);
      updatedUsed.add(newChallenger.value);

      if (choice === 'left') {
        setLeftPassword(updatedWinner);
        setRightPassword(newChallenger);
      } else {
        setLeftPassword(newChallenger);
        setRightPassword(updatedWinner);
      }
      setUsedPasswords(updatedUsed);
    },
    [
      isLoading,
      gameState,
      leftQuery.data,
      rightQuery.data,
      leftPassword,
      rightPassword,
      score,
      usedPasswords,
    ]
  );

  const resetGame = useCallback(() => {
    const newLeft = createInitialPassword();
    const newRight = createInitialPassword([newLeft.value]);
    setLeftPassword(newLeft);
    setRightPassword(newRight);
    setUsedPasswords(new Set([newLeft.value, newRight.value]));
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
    startReveal,
    resetGame,
  };
};
