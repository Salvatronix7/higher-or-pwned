import { useCallback, useState, useMemo, useEffect } from 'react';
import { usePwnedCount } from '~/queries';
import { MAX_ROUNDS_STAYED, GAME_STATES, GUESS_CHOICES, TIMING } from '~/constants';
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
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(TIMING.GAME_TIMER_INITIAL);
  const [countdownValue, setCountdownValue] = useState<number>(TIMING.COUNTDOWN_DURATION);

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

  // Countdown effect (before game starts)
  useEffect(() => {
    if (gameState !== GAME_STATES.COUNTDOWN) {
      return;
    }

    // Transition to PLAYING when countdown reaches 0
    if (countdownValue <= 0) {
      setGameState(GAME_STATES.PLAYING);
      return;
    }

    const interval = setInterval(() => {
      setCountdownValue((prev) => Math.max(0, prev - 100));
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [gameState, countdownValue]);

  // Timer countdown effect
  useEffect(() => {
    // Only tick timer when in PLAYING state
    if (gameState !== GAME_STATES.PLAYING) {
      return;
    }

    // End game if timer reaches 0
    if (timeRemaining <= 0) {
      setGameState(GAME_STATES.GAME_OVER);
      setGameResult({
        score,
        lastLeftPassword: leftPassword.value,
        lastRightPassword: rightPassword.value,
        correctAnswer: GUESS_CHOICES.LEFT, // Default, doesn't matter when time's up
      });
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - TIMING.GAME_TIMER_TICK));
    }, TIMING.GAME_TIMER_TICK);

    return () => {
      clearInterval(interval);
    };
  }, [gameState, timeRemaining, score, leftPassword.value, rightPassword.value]);

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

      setGameState(GAME_STATES.PLAYING);
      const newScore = score + 1;
      setScore(newScore);

      // Add bonus time for correct guess
      setTimeRemaining((prev) => prev + TIMING.GAME_TIMER_BONUS);

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

  const resetGame = useCallback(() => {
    const newLeft = createInitialPassword();
    const newRight = createInitialPassword([newLeft.value]);
    setLeftPassword(newLeft);
    setRightPassword(newRight);
    setUsedPasswords(new Set([newLeft.value, newRight.value]));
    setScore(0);
    setGameState(INITIAL_GAME_STATE);
    setGameResult(null);
    setTimeRemaining(TIMING.GAME_TIMER_INITIAL);
    setCountdownValue(TIMING.COUNTDOWN_DURATION);
  }, []);

  return {
    leftPassword: leftWithCount,
    rightPassword: rightWithCount,
    score,
    gameState,
    isLoading,
    gameResult,
    timeRemaining,
    countdownValue,
    makeGuess,
    startReveal,
    resetGame,
  };
};
