import { memo, useCallback, useMemo, useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { AsciiArtTyping, Button } from '~/components';
import { TerminalText } from '~/components/ui/TerminalText';
import { SARCASTIC_MESSAGES } from '~/constants';
import { getRandomItem } from '~/utils';
import {
  RESULT_ROUTE_TEXT_DELAY_MS,
  RESULT_ROUTE_TITLE_TEXT,
} from './ResultRoute.constants';
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


const ASCII_ART = `
          .                                                      .
        .n                   .                 .                  n.
  .   .dP                  dP                   9b                 9b.    .
 4    qXb         .       dX                     Xb       .        dXp     t
dX.    9Xb      .dXb    __                         __    dXb.     dXP     .Xb
9XXb._       _.dXXXXb dXXXXbo.                 .odXXXXb dXXXXb._       _.dXXP
 9XXXXXXXXXXXXXXXXXXXVXXXXXXXXOo.           .oOXXXXXXXXVXXXXXXXXXXXXXXXXXXXP
  "9XXXXXXXXXXXXXXXXXXXXX'~   ~"OOO8b   d8OOO'~   ~"XXXXXXXXXXXXXXXXXXXXXP'
    "9XXXXXXXXXXXP' "9XX'   DIE    "98v8P'  HUMAN   "XXP' "9XXXXXXXXXXXP'
        ~~~~~~~       9X.          .db|db.          .XP       ~~~~~~~
                        )b.  .dbo.dP'"v'"9b.odb.  .dX(
                      ,dXXXXXXXXXXXb     dXXXXXXXXXXXb.
                     dXXXXXXXXXXXP'   .   "9XXXXXXXXXXXb
                    dXXXXXXXXXXXXb   d|b   dXXXXXXXXXXXXb
                    9XXb'   "XXXXXb.dX|Xb.dXXXXX'   "dXXP
                     "'      9XXXXXX(   )XXXXXXP      "'
                              XXXX X."v'.X XXXX
                              XP^X'"b   d'"X^XX
                              X. 9  "   '  P )X
                              "b  "       '  d'
                               "             '
`;


export const ResultRoute: FC<ResultRouteProps> = ({ score }) => {

  const [showFooter, setShowFooter] = useState(false);
  const navigate = useNavigate();

  const sarcasticMessage = useMemo(() => getRandomItem(SARCASTIC_MESSAGES), []);

  const textDelay = RESULT_ROUTE_TEXT_DELAY_MS;

  const handleRetry = useCallback(() => {
    navigate({ to: '/game' });
  }, [navigate]);

  const handleShare = useCallback(async () => {
    const shareText = `I scored ${score} on HIGHER || PWNED_ - the password breach guessing game! Can you beat my score?`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HIGHER || PWNED_',
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
    <div className="container">
      <Header />
      <main className="main">
        <div className="scoreSection">
          <TerminalText text='score' duration={750} />
          <TerminalText text={score.toString()} duration={750} delay={textDelay} />
        </div>

        <AsciiArtTyping text={ASCII_ART} duration={1000} delay={textDelay * 2} className="asciiArt" />

        <TerminalText
          text={sarcasticMessage}
          duration={750}
          delay={textDelay * 3}
          onAnimationEnd={() => setShowFooter(true)}
        />

        {true && (
          <div className="actions">
            <Button onClick={handleRetry}>retry</Button>
            <Button onClick={handleShare} variant='secondary'>
              share
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}