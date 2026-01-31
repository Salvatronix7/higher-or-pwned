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
  // ─────────────────────────────────────────
  // numeric / sequences
  // ─────────────────────────────────────────
  '1234',
  '12345',
  '123456',
  '1234567',
  '12345678',
  '123456789',
  '1234567890',
  '000000',
  '00000000',
  '111111',
  '11111111',
  '222222',
  '333333',
  '444444',
  '555555',
  '666666',
  '777777',
  '888888',
  '999999',
  '121212',
  '123123',
  '123321',
  '112233',
  '654321',
  '987654321',

  // ─────────────────────────────────────────
  // keyboard patterns
  // ─────────────────────────────────────────
  'qwerty',
  'qwerty1',
  'qwerty12',
  'qwerty123',
  'qwertyuiop',
  'asdf',
  'asdfgh',
  'asdfghjkl',
  'zxcvbn',
  'zxcvbnm',
  '1q2w3e4r',
  '1q2w3e',
  '1qaz2wsx',
  '2wsx3edc',
  'qazwsx',
  'wasd',

  // ─────────────────────────────────────────
  // generic passwords / system defaults
  // ─────────────────────────────────────────
  'password',
  'password1',
  'password12',
  'password123',
  'password1234',
  'passw0rd',
  'p@ssword',
  'admin',
  'admin1',
  'admin123',
  'administrator',
  'root',
  'root123',
  'guest',
  'guest123',
  'user',
  'user123',
  'login',
  'login123',
  'welcome',
  'welcome1',
  'welcome123',
  'letmein',
  'secret',
  'master',
  'default',
  'changeme',
  'trustno1',

  // ─────────────────────────────────────────
  // common dictionary words
  // ─────────────────────────────────────────
  'iloveyou',
  'love',
  'monkey',
  'dragon',
  'sunshine',
  'sunny',
  'shadow',
  'sparkle',
  'princess',
  'football',
  'baseball',
  'soccer',
  'basketball',
  'computer',
  'nothing',
  'freedom',
  'hello',
  'welcomehome',
  'starwars',
  'matrix',
  'superman',
  'batman',
  'spiderman',
  'pokemon',
  'naruto',

  // ─────────────────────────────────────────
  // profanity (extremely common in breaches)
  // ─────────────────────────────────────────
  'fuck',
  'fuckyou',
  'fuckyou1',
  'fuckme',
  'fucker',
  'motherfucker',
  'asshole',
  'bitch',
  'bitches',
  'shit',
  'shithead',
  'dick',
  'pussy',
  'sex',
  'sexy',

  // ─────────────────────────────────────────
  // names (first names only, high frequency)
  // ─────────────────────────────────────────
  'michael',
  'jordan',
  'jessica',
  'charlie',
  'daniel',
  'andrew',
  'thomas',
  'jennifer',
  'joshua',
  'ashley',
  'robert',
  'matthew',
  'james',
  'david',
  'john',
  'sarah',
  'emma',
  'olivia',
  'lucas',
  'alex',
  'chris',

  // ─────────────────────────────────────────
  // pop culture / sports / brands
  // ─────────────────────────────────────────
  'blink182',
  'blink-182',
  'metallica',
  'nirvana',
  'eminem',
  'drake',
  'liverpool',
  'arsenal',
  'chelsea',
  'manutd',
  'manchester',
  'barcelona',
  'realmadrid',
  'juventus',
  'yankees',
  'lakers',
  'ferrari',
  'mercedes',

  // ─────────────────────────────────────────
  // years & common suffixes
  // ─────────────────────────────────────────
  'password2019',
  'password2020',
  'password2021',
  'password2022',
  'password2023',
  'password2024',
  'password2025',
  'admin2020',
  'admin2021',
  'admin2022',
  'admin2023',
  'admin2024',
  'welcome2023',
  'welcome2024',

  // ─────────────────────────────────────────
  // simple variations & placeholders
  // ─────────────────────────────────────────
  'abc123',
  'abcd1234',
  'abc12345',
  'test',
  'test1',
  'test123',
  'testtest',
  'temp',
  'temp123',
  'temporary',
  'demo',
  'demo123',
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
