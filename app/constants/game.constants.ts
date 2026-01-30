export const GAME_STATES = {
  IDLE: 'idle',
  PLAYING: 'playing',
  REVEALING: 'revealing',
  GAME_OVER: 'gameOver',
} as const;

export const GUESS_CHOICES = {
  LEFT: 'left',
  RIGHT: 'right',
} as const;

export const PASSWORD_LIST = [
  '123456',
  'password',
  '123456789',
  '12345',
  '12345678',
  'qwerty',
  '1234567',
  '111111',
  '123123',
  'iloveyou',
  'admin',
  '1234567890',
  'welcome',
  'secret',
  '123321',
  'password123',
  'monkey',
  'dragon',
  'nothing',
  'computer',
  'princess',
  'football',
  'letmein',
  'master',
  'sunny',
  'shadow',
  'sparkle',
  'jordan',
  'michael',
  'charlie',
  'superman',
  'pokemon',
  'blink-182',
  '555555',
  'freedom',
  'fuckyou',
  'trustno1',
  'liverpool',
  'arsenal',
] as const;

export const MAX_ROUNDS_STAYED = 2;

export const SARCASTIC_MESSAGES = [
  'even my dad has a better password',
  'your password game is weaker than 123456',
  'ACCESS DENIED... to good passwords',
  'did you even try?',
  'a script kiddie could do better',
  'the matrix is disappointed',
  'your firewall just cried',
  'not even close, hacker wannabe',
  'password security level: potato',
  'brute force would be overkill here',
] as const;

export type PasswordValue = (typeof PASSWORD_LIST)[number];
