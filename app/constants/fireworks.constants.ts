export type FireworksConfig = {
  launchRate: number;
  particleCount: number;
  fadeRate: number;
  fps?: number;
};

export const FIREWORKS_CONFIG_BY_SCORE: Record<number, FireworksConfig> = {
  [1]: { launchRate: 0.01, particleCount: 12, fadeRate: 0.03, fps: 20 },
  [10]: { launchRate: 0.01, particleCount: 12, fadeRate: 0.03, fps: 20 },
  [15]: { launchRate: 0.02, particleCount: 16, fadeRate: 0.025, fps: 22 },
  [20]: { launchRate: 0.03, particleCount: 20, fadeRate: 0.02, fps: 24 },
  [25]: { launchRate: 0.04, particleCount: 24, fadeRate: 0.02, fps: 26 },
  [30]: { launchRate: 0.05, particleCount: 28, fadeRate: 0.018, fps: 28 },
  [35]: { launchRate: 0.06, particleCount: 32, fadeRate: 0.016, fps: 30 },
  [40]: { launchRate: 0.07, particleCount: 36, fadeRate: 0.014, fps: 32 },
  [45]: { launchRate: 0.08, particleCount: 40, fadeRate: 0.012, fps: 34 },
};

const fireworksConfigScores = Object.keys(FIREWORKS_CONFIG_BY_SCORE)
  .map(Number)
  .sort((a, b) => a - b);

export const getFireworksConfigForScore = (
  score: number
): FireworksConfig | undefined => {
  let selected: FireworksConfig | undefined;

  for (const threshold of fireworksConfigScores) {
    if (score >= threshold) {
      selected = FIREWORKS_CONFIG_BY_SCORE[threshold];
    }
  }

  return selected;
};
