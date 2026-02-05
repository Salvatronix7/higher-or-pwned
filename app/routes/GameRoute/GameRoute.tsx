import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CommandLine } from "~/components/ui/CommandLine";
import { PasswordCard, Timer, Countdown } from "~/components/game";
import { Console } from "~/components/ui/Console/Console";
import { TerminalText } from "~/components/ui/TerminalText";
import { GAME_STATES, GUESS_CHOICES, getFireConfigForScore, ROUTES, TIMING, UI_TEXT } from "~/constants";
import { useGame } from "~/hooks";
import type { GuessChoice } from "~/types";
import "./GameRoute.css";
import type { ScoreDisplayProps } from "./GameRoute.types";
import { FireSimulation } from "~/components/Fire/Fire";

const Header: FC = memo(() => (
  <header className="gameRouteHeader">
    <TerminalText text={UI_TEXT.APP_TITLE} duration={TIMING.TERMINAL_TEXT_DURATION} />
  </header>
));

Header.displayName = "Header";

const ScoreDisplay: FC<ScoreDisplayProps> = memo(({ score }) => (
  <div className="scoreDisplayRoot">
    <CommandLine>{`       ${UI_TEXT.SCORE_LABEL}       `}</CommandLine>
    <CommandLine>{`         ${score}       `}</CommandLine>
  </div>
));

ScoreDisplay.displayName = "ScoreDisplay";

export const GameRoute: FC = () => {
  const navigate = useNavigate();
  const {
    leftPassword,
    rightPassword,
    score,
    gameState,
    isLoading,
    gameResult,
    timeRemaining,
    countdownValue,
    makeGuess,
    startReveal,
  } = useGame();

  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleGuess = useCallback(
    (choice: GuessChoice) => {
      if (!startReveal()) {
        return;
      }
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current);
      }
      revealTimeoutRef.current = setTimeout(() => {
        makeGuess(choice);
      }, TIMING.REVEAL_DELAY * 1000);
    },
    [makeGuess, startReveal],
  );

  useEffect(() => {
    if (gameState === GAME_STATES.GAME_OVER && gameResult) {
      navigate({
        to: ROUTES.RESULT,
        search: {
          score: gameResult.score,
        },
      });
    }
  }, [gameState, gameResult, navigate]);

  useEffect(() => {
    return () => {
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current);
      }
    };
  }, []);

  const fireConfig = useMemo(() => getFireConfigForScore(score), [score]);

  return (
    <main className="gameRouteContainer">
      {gameState === GAME_STATES.COUNTDOWN && (
        <Countdown countdownValue={countdownValue} />
      )}
      {fireConfig && (
        <FireSimulation
          width={200}
          height={150}
          intensity={1}
          {...fireConfig}
          // fps={24}
        />
      )}
      <Console score={score}>
        <div className="gameBoard">
          <PasswordCard
            key={leftPassword.value}
            password={leftPassword}
            guess={() => handleGuess(GUESS_CHOICES.LEFT)}
            isLoading={isLoading}
            isDisabled={gameState !== GAME_STATES.PLAYING}
            showCount={gameState !== GAME_STATES.PLAYING}
            position={GUESS_CHOICES.LEFT}
          />
          <div className='centerDisplay'>
            <Timer timeRemaining={timeRemaining} />
            <ScoreDisplay score={score} />
          </div>
          <PasswordCard
            key={rightPassword.value}
            password={rightPassword}
            guess={() => handleGuess(GUESS_CHOICES.RIGHT)}
            isLoading={isLoading}
            isDisabled={gameState !== GAME_STATES.PLAYING}
            showCount={gameState !== GAME_STATES.PLAYING}
            position={GUESS_CHOICES.RIGHT}
          />
        </div>
      </Console>
    </main>
  );
};
