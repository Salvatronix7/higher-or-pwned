import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AsciiArtTyping, Button, CommandLine } from "~/components";
import { FireworksSimulation } from "~/components/Fireworks/Fireworks";
import { Console } from "~/components/ui/Console/Console";
import {
  createShareText,
  ROUTES,
  SARCASTIC_MESSAGES,
  UI_TEXT
} from "~/constants";
import { getRandomItem } from "~/utils";
import { ASCII_ART } from "./ResultRoute.constants";
import "./ResultRoute.css";

interface ResultRouteProps {
  score: number;
}

const HIGH_SCORE_STORAGE_KEY = "higher-or-pwned:high-score";

type FireworksConfig = {
  rocketRate: number;
  burstSize: number;
  spread: number;
  fps?: number;
};

const fireworksParameters: Array<{ minScore: number; config: FireworksConfig }> = [
  { minScore: 0, config: { rocketRate: 0.04, burstSize: 16, spread: 1.25, fps: 24 } },
  { minScore: 5, config: { rocketRate: 0.06, burstSize: 18, spread: 1.35, fps: 26 } },
  { minScore: 10, config: { rocketRate: 0.08, burstSize: 22, spread: 1.45, fps: 28 } },
  { minScore: 20, config: { rocketRate: 0.11, burstSize: 26, spread: 1.6, fps: 30 } },
  { minScore: 30, config: { rocketRate: 0.14, burstSize: 30, spread: 1.7, fps: 34 } },
  { minScore: 40, config: { rocketRate: 0.18, burstSize: 34, spread: 1.8, fps: 36 } },
];

export const ResultRoute: FC<ResultRouteProps> = ({ score }) => {
  const navigate = useNavigate();
  const [highScore, setHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const sarcasticMessage = useMemo(() => getRandomItem(SARCASTIC_MESSAGES), []);

  const handleRetry = useCallback(() => {
    navigate({ to: ROUTES.GAME });
  }, [navigate]);

  const handleShare = useCallback(async () => {
    const shareText = createShareText(score);

    if (navigator.share) {
      try {
        await navigator.share({
          title: UI_TEXT.SHARE_TITLE,
          text: shareText,
        });
      } catch {
        await navigator.clipboard.writeText(shareText);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  }, [score]);

  const asciiArt = useMemo(() => getRandomItem(ASCII_ART), []);
  const fireworksConfig = useMemo(() => {
    const sorted = [...fireworksParameters].sort((a, b) => b.minScore - a.minScore);
    return sorted.find((entry) => score >= entry.minScore)?.config ?? fireworksParameters[0]?.config;
  }, [score]);
  const showFireworks = isNewHighScore && score > 0;

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(HIGH_SCORE_STORAGE_KEY) ?? 0);
    const nextHighScore = Number.isFinite(stored) ? stored : 0;
    const didSetNewHighScore = score > 0 && score > nextHighScore;

    if (didSetNewHighScore) {
      window.localStorage.setItem(HIGH_SCORE_STORAGE_KEY, score.toString());
      setHighScore(score);
      setIsNewHighScore(true);
    } else {
      setHighScore(Math.max(nextHighScore, score));
      setIsNewHighScore(false);
    }
  }, [score]);

  return (
    <div className="container">
      {showFireworks && (
        <FireworksSimulation
          width={200}
          height={120}
          {...fireworksConfig}
        />
      )}
      <Console>
        <main className="main">
          <div className="scoreSection">
            <CommandLine duration={.5}>{UI_TEXT.SCORE_LABEL.toLowerCase()}</CommandLine>
            <CommandLine duration={.5} delay={.5}>{score.toString()}</CommandLine>
            {isNewHighScore && (
              <CommandLine duration={.5} delay={1}>
                {`new high score: ${highScore}`}
              </CommandLine>
            )}
          </div>

          <AsciiArtTyping text={asciiArt} duration={.5} delay={1.5} className="asciiArt" />


          <div className="actions">
            <Button onClick={handleRetry} duration={.5} delay={2} width={10}>{UI_TEXT.RETRY_BUTTON}</Button>
            <Button onClick={handleShare} duration={.5} delay={2} width={10}>
              {UI_TEXT.SHARE_BUTTON}
            </Button>
          </div>

          <CommandLine duration={1} delay={3} keepCursorAnimation withCursor>{sarcasticMessage}</CommandLine>
        </main>
      </Console>
    </div>
  );
};
