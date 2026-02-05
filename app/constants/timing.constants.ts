export const TIMING = {
  TERMINAL_TEXT_DURATION: 1,
  TERMINAL_TEXT_DEFAULT_DURATION: 2,
  TERMINAL_TEXT_DEFAULT_DELAY: 0,
  REVEAL_DELAY: 2,
  ASCII_ART_DURATION: 1,
  COUNTDOWN_DURATION: 3000, // 3 seconds countdown before game starts
  GAME_TIMER_INITIAL: 15000, // 15 seconds in milliseconds
  GAME_TIMER_BONUS: 3000, // 3 seconds bonus for correct guess
  GAME_TIMER_TICK: 10, // Timer update interval in milliseconds
} as const;
