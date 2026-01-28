export const ROUTES = {
  HOME: '/',
  GAME: '/game',
  RESULT: '/result',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
