import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePwnedCount } from '~/queries';
import {
  MAX_ROUNDS_STAYED,
  GAME_STATES,
  GUESS_CHOICES,
  TIMING,
} from '~/constants';
import type { GameResult, GuessChoice, Password } from '~/types';
import { INITIAL_GAME_STATE } from './useGame.constants';
import type { UseGameReturn } from './useGame.types';
import { createInitialPassword } from './useGame.utils';

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
  const [timeRemaining, setTimeRemaining] = useState(
    TIMING.GAME_START_SECONDS
  );
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
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
    if (isLoading || gameState !== GAME_STATES.PLAYING) {
      return false;
    }
    setGameState(GAME_STATES.REVEALING);
    return true;
  }, [gameState, isLoading]);

  const makeGuess = useCallback(
    (choice: GuessChoice) => {
      if (isLoading || gameState === GAME_STATES.GAME_OVER) return;

      const leftCount = leftQuery.data ?? 0;
      const rightCount = rightQuery.data ?? 0;

      const correctChoice: GuessChoice =
        leftCount >= rightCount ? GUESS_CHOICES.LEFT : GUESS_CHOICES.RIGHT;
      const isCorrect = choice === correctChoice;

      if (!isCorrect) {
        setGameState(GAME_STATES.GAME_OVER);
        setGameResult({
          score,
          lastLeftPassword: leftPassword.value,
          lastRightPassword: rightPassword.value,
          correctAnswer: correctChoice,
        });
        return;
      }

      setGameState(INITIAL_GAME_STATE);
      const newScore = score + 1;
      setScore(newScore);
      setTimeRemaining(
        (currentTime) => currentTime + TIMING.GAME_BONUS_SECONDS
      );

      const updatedUsed = new Set(usedPasswords);
      updatedUsed.add(leftPassword.value);
      updatedUsed.add(rightPassword.value);

      const winner = choice === GUESS_CHOICES.LEFT ? leftPassword : rightPassword;
      const winnerCount = choice === GUESS_CHOICES.LEFT ? leftCount : rightCount;
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

      if (choice === GUESS_CHOICES.LEFT) {
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

  useEffect(() => {
    if (gameState === GAME_STATES.GAME_OVER) {
      return;
    }

    const timerId = window.setInterval(() => {
      setTimeRemaining((currentTime) => {
        if (currentTime <= 1) {
          const leftCount = leftQuery.data ?? 0;
          const rightCount = rightQuery.data ?? 0;
          const correctChoice: GuessChoice =
            leftCount >= rightCount ? GUESS_CHOICES.LEFT : GUESS_CHOICES.RIGHT;

          setGameState(GAME_STATES.GAME_OVER);
          setGameResult({
            score,
            lastLeftPassword: leftPassword.value,
            lastRightPassword: rightPassword.value,
            correctAnswer: correctChoice,
          });

          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [
    gameState,
    leftQuery.data,
    rightQuery.data,
    leftPassword.value,
    rightPassword.value,
    score,
  ]);

  const resetGame = useCallback(() => {
    const newLeft = createInitialPassword();
    const newRight = createInitialPassword([newLeft.value]);
    setLeftPassword(newLeft);
    setRightPassword(newRight);
    setUsedPasswords(new Set([newLeft.value, newRight.value]));
    setScore(0);
    setTimeRemaining(TIMING.GAME_START_SECONDS);
    setGameState(INITIAL_GAME_STATE);
    setGameResult(null);
  }, []);

  return {
    leftPassword: leftWithCount,
    rightPassword: rightWithCount,
    score,
    timeRemaining,
    gameState,
    isLoading,
    gameResult,
    makeGuess,
    startReveal,
    resetGame,
  };
};
