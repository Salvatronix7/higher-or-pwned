import { memo, useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import type { GameOfLifePreProps } from './GameOfLifePre.types';
import './GameOfLifePre.css';

const createRandomGrid = (width: number, height: number) =>
  Array.from({ length: height }, () =>
    Array.from({ length: width }, () => Math.random() > 0.7),
  );

const countNeighbors = (grid: boolean[][], x: number, y: number) => {
  let count = 0;
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) {
        continue;
      }
      const row = y + rowOffset;
      const col = x + colOffset;
      if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
        continue;
      }
      if (grid[row][col]) {
        count += 1;
      }
    }
  }
  return count;
};

const stepGrid = (grid: boolean[][]) =>
  grid.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      const neighbors = countNeighbors(grid, colIndex, rowIndex);
      if (cell) {
        return neighbors === 2 || neighbors === 3;
      }
      return neighbors === 3;
    }),
  );

export const GameOfLifePre: FC<GameOfLifePreProps> = memo(
  ({ width, height, fps }) => {
    const [grid, setGrid] = useState(() => createRandomGrid(width, height));

    useEffect(() => {
      setGrid(createRandomGrid(width, height));
    }, [width, height]);

    useEffect(() => {
      if (fps <= 0) {
        return;
      }
      const interval = window.setInterval(() => {
        setGrid((current) => stepGrid(current));
      }, 1000 / fps);
      return () => window.clearInterval(interval);
    }, [fps]);

    const output = useMemo(
      () =>
        grid
          .map((row) => row.map((cell) => (cell ? '█' : ' ')).join(''))
          .join('\n'),
      [grid],
    );

    return <pre className='gameOfLifePre'>{output}</pre>;
  },
);

GameOfLifePre.displayName = 'GameOfLifePre';
