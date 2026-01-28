import { memo, useCallback, useMemo, useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '~/components';
import { TerminalText } from '~/components/ui/TerminalText';
import { SARCASTIC_MESSAGES } from '~/constants';
import { getRandomItem } from '~/utils';
import {
  RESULT_ROUTE_ASCII_ART,
  RESULT_ROUTE_SHARE_TITLE,
  RESULT_ROUTE_TEXT_DELAY_MS,
  RESULT_ROUTE_TITLE_TEXT,
} from './ResultRoute.constants';
import { getShareText } from './ResultRoute.utils';
import './ResultRoute.css';

interface ResultRouteProps {
  score: number;
}

const Header: FC = memo(() => (
  <header className='resultRouteHeader'>
    <TerminalText text={RESULT_ROUTE_TITLE_TEXT} duration={750} />
  </header>
));

Header.displayName = 'Header';

export const ResultRoute: FC<ResultRouteProps> = ({ score }) => {
  const [showFooter, setShowFooter] = useState(false);
  const navigate = useNavigate();

  const sarcasticMessage = useMemo(() => getRandomItem(SARCASTIC_MESSAGES), []);

  const handleRetry = useCallback(() => {
    navigate({ to: '/game' });
  }, [navigate]);

  const handleShare = useCallback(async () => {
    const shareText = getShareText(score);

    if (navigator.share) {
      try {
        await navigator.share({
          title: RESULT_ROUTE_SHARE_TITLE,
          text: shareText,
        });
      } catch {
        await navigator.clipboard.writeText(shareText);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  }, [score]);

  return (
    <div className='resultRouteContainer'>
      <Header />
      <main className='resultRouteMain'>
        <div className='resultRouteScoreSection'>
          <TerminalText text='score' duration={750} />
          <TerminalText
            text={score.toString()}
            duration={750}
            delay={RESULT_ROUTE_TEXT_DELAY_MS}
          />
        </div>

        <pre className='resultRouteAsciiArt'>{RESULT_ROUTE_ASCII_ART}</pre>

        <TerminalText
          text={sarcasticMessage}
          duration={750}
          delay={RESULT_ROUTE_TEXT_DELAY_MS}
          className='resultRouteMessage'
          onAnimationEnd={() => setShowFooter(true)}
        />

        {showFooter && (
          <div className='resultRouteActions'>
            <Button onClick={handleRetry}>retry</Button>
            <Button onClick={handleShare} variant='secondary'>
              share
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};
