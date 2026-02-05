import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { useCallback, useMemo } from "react";
import { AsciiArtTyping } from "~/components/ui/AsciiArtTyping";
import { Button } from "~/components/ui/Button";
import { CommandLine } from "~/components/ui/CommandLine";
import { FireSimulation } from "~/components/Fire/Fire";
import { Console } from "~/components/ui/Console/Console";
import {
  createShareText,
  getFireConfigForScore,
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

export const ResultRoute: FC<ResultRouteProps> = ({ score }) => {
  const navigate = useNavigate();

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
  const fireConfig = useMemo(() => getFireConfigForScore(score), [score]);

  return (
    <div className="container">
      {fireConfig && (
        <FireSimulation
          width={200}
          height={75}
          intensity={1}
          {...fireConfig}
        />
      )}
      <Console>
        <main className="main">
          <div className="scoreSection">
            <CommandLine duration={.5}>{UI_TEXT.SCORE_LABEL.toLowerCase()}</CommandLine>
            <CommandLine duration={.5} delay={.5}>{score.toString()}</CommandLine>
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
