export const GAME_STATES = {
  IDLE: 'idle',
  COUNTDOWN: 'countdown',
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
  // numeric / simple patterns
  // ─────────────────────────────────────────
  '123123123',
  '111222',
  '222333',
  '333444',
  '444555',
  '555666',
  '666777',
  '777888',
  '888999',
  '999000',
  '101010',
  '010101',
  '12121212',
  '131313',
  '141414',
  '151515',

  // ─────────────────────────────────────────
  // ascending / descending
  // ─────────────────────────────────────────
  '012345',
  '0123456',
  '01234567',
  '012345678',
  '987654',
  '87654321',
  '7654321',
  '543210',

  // ─────────────────────────────────────────
  // repeated blocks
  // ─────────────────────────────────────────
  '12341234',
  '43214321',
  '111222333',
  '000111',
  '999888',
  '112211',
  '121221',

  // ─────────────────────────────────────────
  // years / dates (ultra comunes)
  // ─────────────────────────────────────────
  '1990',
  '1991',
  '1992',
  '1993',
  '1994',
  '1995',
  '1996',
  '1997',
  '1998',
  '1999',
  '2000',
  '2001',
  '2002',
  '2020',
  '2021',
  '2022',
  '2023',

  // ─────────────────────────────────────────
  // keypad patterns (numpad vibes)
  // ─────────────────────────────────────────
  '147258',
  '258369',
  '369258',
  '159753',
  '753159',
  '741852',

  // ─────────────────────────────────────────
  // very short but super used
  // ─────────────────────────────────────────
  '0000',
  '1111',
  '2222',
  '3333',
  '4444',
  '5555',
  '6666',
  '7777',
  '8888',
  '9999',

  // ─────────────────────────────────────────
  // keyboard patterns (expanded)
  // ─────────────────────────────────────────
  'qwert',
  'qwertyu',
  'qwertyui',
  'qwertyui',
  'qwertyuiop[]',
  'qwertyuiopasdf',
  'qwertyqwerty',

  // ─────────────────────────────────────────
  // asdf row variations
  // ─────────────────────────────────────────
  'asdfg',
  'asdfghj',
  'asdfjkl',
  'asdfasdf',
  'asdf1234',
  'asdfgh123',
  'asdf@123',

  // ─────────────────────────────────────────
  // zxc row variations
  // ─────────────────────────────────────────
  'zxcv',
  'zxcvb',
  'zxcvbn',
  'zxcvbnmz',
  'zxcv123',
  'zxcvbn123',

  // ─────────────────────────────────────────
  // WASD / gamer classics
  // ─────────────────────────────────────────
  'wasdqwer',
  'wasd123',
  'wasdwasd',
  'wasdqaz',
  'wasdx',

  // ─────────────────────────────────────────
  // diagonal / snake patterns
  // ─────────────────────────────────────────
  'qaz',
  'qazws',
  'qazwsxedc',
  'wsxedc',
  'edcrfv',
  'rfvtgb',
  'tgbnhy',

  // ─────────────────────────────────────────
  // number + keyboard mashups
  // ─────────────────────────────────────────
  '1q2w3e',
  '1q2w3e4r5t',
  '1q2w3e4r',
  '123qwe',
  'qwe123',
  'qweasd',
  'qweasdzxc',

  // ─────────────────────────────────────────
  // mirror / repetition
  // ─────────────────────────────────────────
  'qweqwe',
  'asdasd',
  'zxczxc',
  'qweasdqwe',
  'wasdwasd123',


  // ─────────────────────────────────────────
  // generic passwords / system defaults (expanded)
  // ─────────────────────────────────────────
  'password!',
  'password@',
  'password2020',
  'password2021',
  'password2022',
  'password2023',

  'adminadmin',
  'admin@123',
  'admin2020',
  'admin2021',
  'admin2022',
  'admin2023',

  'rootroot',
  'root@123',
  'superuser',
  'sysadmin',

  'useruser',
  'user@123',
  'guestguest',

  // ─────────────────────────────────────────
  // onboarding / welcome classics
  // ─────────────────────────────────────────
  'welcome!',
  'welcome@123',
  'welcome2020',
  'welcome2021',
  'welcome2022',
  'welcome2023',

  'newuser',
  'newuser123',
  'firstlogin',
  'firsttime',

  // ─────────────────────────────────────────
  // corporate / IT nightmares
  // ─────────────────────────────────────────
  'company',
  'company123',
  'office',
  'office123',
  'server',
  'server123',
  'database',
  'database123',

  // ─────────────────────────────────────────
  // “sounds secure but isn’t”
  /* ─────────────────────────────────────── */
  'secure',
  'secure123',
  'security',
  'security123',
  'passwordsecure',
  'mypassword',
  'mypassword123',

  // ─────────────────────────────────────────
  // memes / old-school leaked lists
  // ─────────────────────────────────────────
  'iloveyou',
  'loveyou',
  'monkey',
  'dragon',
  'sunshine',
  'princess',
  'football',
  'baseball',
  'freedom',

  // ─────────────────────────────────────────
  // common dictionary words (expanded)
  // ─────────────────────────────────────────
  'iloveyou1',
  'iloveyou123',
  'love123',
  'loveu',
  'loveu2',
  'lovers',

  // ─────────────────────────────────────────
  // animals / fantasy clichés
  // ─────────────────────────────────────────
  'tiger',
  'wolf',
  'eagle',
  'lion',
  'dragon123',
  'phoenix',
  'unicorn',
  'panther',
  'shadow123',
  'darkness',

  // ─────────────────────────────────────────
  // positive / feel-good words
  // ─────────────────────────────────────────
  'happy',
  'smile',
  'smiley',
  'angel',
  'angels',
  'heaven',
  'rainbow',
  'peace',
  'hope',
  'dream',
  'dreamer',

  // ─────────────────────────────────────────
  // sports & hobbies
  // ─────────────────────────────────────────
  'soccer123',
  'football123',
  'basketball123',
  'gamer',
  'gaming',
  'playstation',
  'xbox',
  'nintendo',

  // ─────────────────────────────────────────
  // tech / internet words
  // ─────────────────────────────────────────
  'internet',
  'google',
  'youtube',
  'facebook',
  'instagram',
  'linkedin',
  'computer123',
  'laptop',

  // ─────────────────────────────────────────
  // pop culture / fandom
  // ─────────────────────────────────────────
  'harrypotter',
  'marvel',
  'avengers',
  'ironman',
  'thor',
  'joker',
  'batman123',
  'superman123',
  'starwars123',
  'pokemon123',
  'pikachu',

  // ─────────────────────────────────────────
  // names & generic human stuff
  // ─────────────────────────────────────────
  'family',
  'friends',
  'friend',
  'mylove',
  'mylife',
  'myworld',
  'forever',
  'always',

  // ─────────────────────────────────────────
  // profanity (extremely common in breaches)
  // ─────────────────────────────────────────
  'fuck123',
  'fucking',
  'fucking123',
  'fuckoff',
  'fuckoff1',
  'fucked',
  'fuckit',

  // ─────────────────────────────────────────
  // insults / rage passwords
  // ─────────────────────────────────────────
  'idiot',
  'idiots',
  'stupid',
  'dumbass',
  'jackass',
  'loser',
  'losers',
  'jerk',
  'prick',

  // ─────────────────────────────────────────
  // shit variations (ultra comunes)
  // ───────────────────────────────────────
  'shit123',
  'shitty',
  'holyshit',
  'shitshit',
  'ohshit',
  'bullshit',
  'bullshit123',

  // ─────────────────────────────────────────
  // sexual / edgy basics
  // ─────────────────────────────────────────
  'sex123',
  'sexy123',
  'hotsex',
  'sexsex',
  'xxx',
  'xxx123',
  'porno',
  'porn',
  'porn123',

  // ─────────────────────────────────────────
  // combinations people think are clever
  // ─────────────────────────────────────────
  'fuckpassword',
  'passwordfuck',
  'fuckyoupassword',
  'adminfuck',
  'fuckadmin',
  'rootfuck',

  // ─────────────────────────────────────────
  // repetition / emphasis
  // ─────────────────────────────────────────
  'fuckfuck',
  'shitshit',
  'sexsex',
  'bitchbitch',

  // ─────────────────────────────────────────
  // names (first names only, high frequency)
  // ─────────────────────────────────────────
  'mark',
  'paul',
  'steven',
  'kevin',
  'brian',
  'jason',
  'ryan',
  'eric',
  'adam',
  'aaron',

  // ─────────────────────────────────────────
  // female names (very common)
  // ───────────────────────────────────────
  'amanda',
  'melissa',
  'laura',
  'stephanie',
  'rebecca',
  'emily',
  'hannah',
  'samantha',
  'nicole',
  'elizabeth',

  // ─────────────────────────────────────────
  // short / nickname-style (dangerously common)
  // ─────────────────────────────────────────
  'mike',
  'dan',
  'rob',
  'joe',
  'sam',
  'ben',
  'anna',
  'kate',
  'lisa',
  'amy',

  // ─────────────────────────────────────────
  // modern high-frequency
  // ─────────────────────────────────────────
  'liam',
  'noah',
  'ethan',
  'logan',
  'jake',
  'jack',
  'leo',
  'mia',
  'ava',
  'ella',

  // ─────────────────────────────────────────
  // pop culture / sports / brands (expanded)
  // ─────────────────────────────────────────
  'coldplay',
  'queen',
  'beatles',
  'linkinpark',
  'greenday',
  'acdc',
  'pinkfloyd',
  'gunsnroses',

  // ─────────────────────────────────────────
  // artists / celebrities
  // ─────────────────────────────────────────
  'rihanna',
  'beyonce',
  'taylorswift',
  'kanyewest',
  'drdre',
  'snoopdogg',
  'justinbieber',
  'arianagrande',

  // ─────────────────────────────────────────
  // football (global ultra common)
  // ─────────────────────────────────────────
  'chelseafc',
  'liverpoolfc',
  'manutd123',
  'realmadrid123',
  'barca',
  'fcb',
  'psg',
  'bayern',
  'ajax',
  'milan',
  'inter',

  // ─────────────────────────────────────────
  // US sports
  // ─────────────────────────────────────────
  'warriors',
  'celtics',
  'bulls',
  'cowboys',
  'patriots',
  'giants',
  'dodgers',
  'redsox',

  // ─────────────────────────────────────────
  // cars / brands
  // ─────────────────────────────────────────
  'bmw',
  'audi',
  'toyota',
  'honda',
  'nissan',
  'porsche',
  'lamborghini',
  'ford',
  'tesla',

  // ─────────────────────────────────────────
  // gaming / tech brands
  // ─────────────────────────────────────────
  'playstation',
  'xbox',
  'steam',
  'epicgames',
  'nintendo',
  'pokemon',
  'leagueoflegends',
  'fortnite',

  // ─────────────────────────────────────────
  // years & common suffixes (expanded)
  // ─────────────────────────────────────────
  'password18',
  'password19',
  'password20',
  'password21',
  'password22',
  'password23',
  'password24',
  'password25',

  'admin19',
  'admin20',
  'admin21',
  'admin22',
  'admin23',
  'admin24',
  'admin25',

  'user2020',
  'user2021',
  'user2022',
  'user2023',
  'user2024',

  // ─────────────────────────────────────────
  // welcome / onboarding
  // ─────────────────────────────────────────
  'welcome2020',
  'welcome2021',
  'welcome2022',
  'welcome2025',

  'login2020',
  'login2021',
  'login2022',
  'login2023',
  'login2024',

  // ─────────────────────────────────────────
  // generic word + year
  // ─────────────────────────────────────────
  'love2020',
  'love2021',
  'love2022',
  'love2023',
  'love2024',

  'football2020',
  'football2021',
  'football2022',
  'football2023',

  // ─────────────────────────────────────────
  // name + year (extremely common pattern)
  // ─────────────────────────────────────────
  'alex2020',
  'alex2021',
  'john2020',
  'john2021',
  'mike2022',
  'sarah2023',

  // ─────────────────────────────────────────
  // lazy suffixes (people think this helps)
  // ─────────────────────────────────────────
  'password!',
  'password@',
  'password#',
  'admin!',
  'admin@',
  'admin#',

  'password01',
  'password02',
  'password03',
  'password123!',

  // ─────────────────────────────────────────
  // simple variations & placeholders (expanded)
  // ─────────────────────────────────────────
  'abc',
  'abcd',
  'abcde',
  'abcdef',
  'abcdefg',

  // ─────────────────────────────────────────
  // abc + numbers (ultra clásico)
  // ───────────────────────────────────────
  'abc1',
  'abc12',
  'abc1234',
  'abc123456',
  'abcd123',
  'abcd12345',

  // ─────────────────────────────────────────
  // test variants
  // ─────────────────────────────────────────
  'test2',
  'test12',
  'test1234',
  'testing',
  'testing123',
  'testpass',
  'testpassword',

  // ─────────────────────────────────────────
  // temp / placeholder hell
  // ─────────────────────────────────────────
  'temp1',
  'temp12',
  'temp2023',
  'temp2024',
  'tmp',
  'tmp123',
  'placeholder',
  'placeholder123',

  // ─────────────────────────────────────────
  // demo / example
  // ─────────────────────────────────────────
  'demo1',
  'demo12',
  'demo2023',
  'demo2024',
  'example',
  'example123',

  // ─────────────────────────────────────────
  // dev / default environment
  // ─────────────────────────────────────────
  'dev',
  'dev123',
  'devpass',
  'default1',
  'default123',
  'sample',
  'sample123',
] as const;



export const MAX_ROUNDS_STAYED = 2;

export const SARCASTIC_MESSAGES = [
  // ─────────────────────────────────────────
  // sarcastic lose messages
  // ─────────────────────────────────────────
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

  // ─────────────────────────────────────────
  // classic dev sarcasm
  // ─────────────────────────────────────────
  'works on my machine, not on yours',
  'TODO: learn about passwords',
  'this would fail a security audit',
  'commit message: "oops"',
  'deprecated thinking detected',
  'legacy mindset confirmed',

  // ─────────────────────────────────────────
  // hacker / cyber clichés
  // ─────────────────────────────────────────
  'anonymous just unfollowed you',
  'mr. robot turned off the screen',
  'hackers everywhere are laughing',
  'this password was leaked in 2008',
  'congratulations, you hacked yourself',
  'zero-day skill, zero-day effort',

  // ─────────────────────────────────────────
  // brutal but funny
  // ─────────────────────────────────────────
  'my toaster has better security',
  'this password expired emotionally',
  'please stop embarrassing encryption',
  'password strength: vibes only',
  'security through optimism detected',
  'this ain’t it, chief',

  // ─────────────────────────────────────────
  // UI / system style
  // ─────────────────────────────────────────
  'ERROR 401: common password detected',
  'ERROR 418: i’m a teapot, not a miracle',
  'LOGIN FAILED: imagination missing',
  'SYSTEM WARNING: creativity low',
  'CRITICAL: reused braincell',

  // ─────────────────────────────────────────
  // short & punchy (great for fast rounds)
  // ─────────────────────────────────────────
  'yikes',
  'big oof',
  'try harder',
  'nope',
  'that ain’t it',
  'ouch',
  'pls stop',
] as const;

export type PasswordValue = (typeof PASSWORD_LIST)[number];
