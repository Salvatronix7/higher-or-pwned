export const UI_TEXT = {
  APP_TITLE: 'HIGHER || PWNED',
  SCORE_LABEL: 'SCORE',
  TIME_LABEL: 'TIME',
  GAME_INSTRUCTION: '> click the password with MORE breaches_',
  START_PROMPT: '> press any key to start',
  LOADING: 'loading...',
  RETRY_BUTTON: 'retry',
  SHARE_BUTTON: 'share',
  SHARE_TITLE: 'HIGHER || PWNED_',
} as const;

export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
} as const;

export const RESULT_ASCII_ART = `
          .-"""-.
         /        \\
        /_        _\\
       // \\      / \\\\
       |\\__\\    /__/|
       \\    ||    /
        \\        /
         \\  __  /
          '.__.'
           |  |
          /|  |\\
         (_|  |_)
`;

export const createShareText = (score: number): string =>
  `I scored ${score} on HIGHER || PWNED_ - the password breach guessing game! Can you beat my score?`;
