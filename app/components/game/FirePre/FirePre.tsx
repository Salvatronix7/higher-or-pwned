import { memo, useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import type { FirePreHeatSource, FirePreProps } from './FirePre.types';
import './FirePre.css';

const MAX_INTENSITY = 15;
const FIRE_CHARS = [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@', '█'];

const createEmptyGrid = (width: number, height: number) =>
  Array.from({ length: height }, () => Array.from({ length: width }, () => 0));

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const seedBottomRow = (grid: number[][], width: number) => {
  const lastRowIndex = grid.length - 1;
  const seeded = grid.map((row) => [...row]);
  seeded[lastRowIndex] = Array.from({ length: width }, () => MAX_INTENSITY);
  return seeded;
};

const applyHeatSource = (
  grid: number[][],
  heatSource: FirePreHeatSource,
) => {
  const height = grid.length;
  const width = grid[0].length;
  const next = grid.map((row) => [...row]);
  const startX = clamp(heatSource.x, 0, width - 1);
  const startY = clamp(heatSource.y, 0, height - 1);
  const endX = clamp(startX + heatSource.size - 1, 0, width - 1);
  const endY = clamp(startY + heatSource.size - 1, 0, height - 1);

  for (let y = startY; y <= endY; y += 1) {
    for (let x = startX; x <= endX; x += 1) {
      next[y][x] = MAX_INTENSITY;
    }
  }

  return next;
};

const getSeededGrid = (
  width: number,
  height: number,
  heatSource: FirePreHeatSource,
  useBottomSeed: boolean,
) => {
  const empty = createEmptyGrid(width, height);
  const seeded = useBottomSeed ? seedBottomRow(empty, width) : empty;
  return applyHeatSource(seeded, heatSource);
};

const stepFire = (
  grid: number[][],
  heatSource: FirePreHeatSource,
  useBottomSeed: boolean,
) => {
  const height = grid.length;
  const width = grid[0].length;
  const next = createEmptyGrid(width, height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (y === height - 1) {
        if (useBottomSeed) {
          next[y][x] = MAX_INTENSITY;
        }
        continue;
      }
      const below = grid[y + 1][x];
      const belowLeft = grid[y + 1][Math.max(0, x - 1)];
      const belowRight = grid[y + 1][Math.min(width - 1, x + 1)];
      const weighted = Math.floor((below * 2 + belowLeft + belowRight) / 4);
      const decay = Math.floor(Math.random() * 4);
      const intensity = clamp(weighted - decay, 0, MAX_INTENSITY);
      const drift = clamp(
        x + (Math.floor(Math.random() * 3) - 1),
        0,
        width - 1,
      );
      next[y][drift] = Math.max(next[y][drift], intensity);
    }
  }

  return applyHeatSource(next, heatSource);
};

export const FirePre: FC<FirePreProps> = memo(
  ({ width, height, fps, heatSource, useBottomSeed = true }) => {
    const [grid, setGrid] = useState(() =>
      getSeededGrid(width, height, heatSource, useBottomSeed),
    );

    useEffect(() => {
      setGrid(getSeededGrid(width, height, heatSource, useBottomSeed));
    }, [width, height, heatSource, useBottomSeed]);

    useEffect(() => {
      if (fps <= 0) {
        return;
      }
      const interval = window.setInterval(() => {
        setGrid((current) => stepFire(current, heatSource, useBottomSeed));
      }, 1000 / fps);
      return () => window.clearInterval(interval);
    }, [fps, heatSource, useBottomSeed]);

    const output = useMemo(
      () =>
        grid
          .map((row) =>
            row
              .map((cell) => {
                const charIndex = Math.floor(
                  (cell / MAX_INTENSITY) * (FIRE_CHARS.length - 1),
                );
                return FIRE_CHARS[charIndex];
              })
              .join(''),
          )
          .join('\n'),
      [grid],
    );

    return <pre className='firePre'>{output}</pre>;
  },
);

FirePre.displayName = 'FirePre';
