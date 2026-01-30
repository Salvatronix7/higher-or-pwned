import { memo, useCallback, useMemo, useState } from "react";
import type { FC } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AsciiArtTyping, Button, CommandLine } from "~/components";
import { TerminalText } from "~/components/ui/TerminalText";
import {
  ROUTES,
  SARCASTIC_MESSAGES,
  UI_TEXT,
  TIMING,
  createShareText,
  RESULT_ASCII_ART,
} from "~/constants";
import { getRandomItem } from "~/utils";
import "./ResultRoute.css";
import { Console } from "~/components/ui/Console/Console";
import { ASCII_ART } from "./ResultRoute.constants";

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

  return (
    <div className="container">
      <Console>
        <main className="main">
          <div className="scoreSection">
            <CommandLine duration={.5}>{UI_TEXT.SCORE_LABEL.toLowerCase()}</CommandLine>
            <CommandLine duration={1} delay={.5}>{score.toString()}</CommandLine>
          </div>

          <AsciiArtTyping text={asciiArt} duration={1} delay={.5 * 5} className="asciiArt" />


          <div className="actions">
            <Button onClick={handleRetry} duration={1} delay={1 * 4}>{UI_TEXT.RETRY_BUTTON}</Button>
            <Button onClick={handleShare} duration={1} delay={1 * 4}>
              {UI_TEXT.SHARE_BUTTON}
            </Button>
          </div>

          <CommandLine duration={TIMING.TERMINAL_TEXT_DURATION} delay={TIMING.TERMINAL_TEXT_DURATION * 5} keepCursorAnimation withCursor>{sarcasticMessage}</CommandLine>
        </main>
      </Console>
    </div>
  );
};
