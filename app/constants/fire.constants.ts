export type FireConfig = {
  decay: number;
  sparkRate: number;
  cooling: number;
  fps?: number;
};

export type FireworksConfig = {
  burstRate: number;
  particlesPerBurst: number;
  gravity: number;
  fps?: number;
};

export const FIRE_CONFIG_BY_SCORE: Record<number, FireConfig> = {
  [1]: { decay: 0.1, sparkRate: 0, cooling: 0, fps: 24 },
  [5]: { decay: 0.5, sparkRate: 0.25, cooling: 0, fps: 26 },
  [10]: { decay: 0.2, sparkRate: 0.75, cooling: 0, fps: 28 },
  [15]: { decay: 0.1, sparkRate: 0.75, cooling: 0, fps: 30 },
  [20]: { decay: 0.05, sparkRate: 0.75, cooling: 0, fps: 32 },
  [25]: { decay: 0.02, sparkRate: 0.8, cooling: 0, fps: 34 },
  [30]: { decay: 0.01, sparkRate: 0.8, cooling: 0, fps: 36 },
  [35]: { decay: 0.01, sparkRate: 0.9, cooling: 0, fps: 38 },
  [40]: { decay: 0.01, sparkRate: 1, cooling: 0, fps: 40 },
  [45]: { decay: 0, sparkRate: 1, cooling: 0, fps: 40 },
};

export const FIREWORKS_CONFIG_BY_SCORE: Record<number, FireworksConfig> = {
  [10]: { burstRate: 0.05, particlesPerBurst: 10, gravity: 0.15, fps: 30 },
  [20]: { burstRate: 0.08, particlesPerBurst: 12, gravity: 0.12, fps: 32 },
  [30]: { burstRate: 0.12, particlesPerBurst: 15, gravity: 0.1, fps: 34 },
  [40]: { burstRate: 0.15, particlesPerBurst: 18, gravity: 0.08, fps: 36 },
  [50]: { burstRate: 0.2, particlesPerBurst: 20, gravity: 0.08, fps: 40 },
};

const fireConfigScores = Object.keys(FIRE_CONFIG_BY_SCORE)
  .map(Number)
  .sort((a, b) => a - b);

const fireworksConfigScores = Object.keys(FIREWORKS_CONFIG_BY_SCORE)
  .map(Number)
  .sort((a, b) => a - b);

export const getFireConfigForScore = (score: number): FireConfig | undefined => {
  let selected: FireConfig | undefined;

  for (const threshold of fireConfigScores) {
    if (score >= threshold) {
      selected = FIRE_CONFIG_BY_SCORE[threshold];
    }
  }

  return selected;
};

export const getFireworksConfigForScore = (score: number): FireworksConfig | undefined => {
  let selected: FireworksConfig | undefined;

  for (const threshold of fireworksConfigScores) {
    if (score >= threshold) {
      selected = FIREWORKS_CONFIG_BY_SCORE[threshold];
    }
  }

  return selected;
};
