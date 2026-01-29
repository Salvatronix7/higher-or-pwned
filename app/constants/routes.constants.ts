export const ROUTES = {
  HOME: '/',
  GAME: '/game',
  RESULT: '/result',
  PLAYERS: '/players',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
