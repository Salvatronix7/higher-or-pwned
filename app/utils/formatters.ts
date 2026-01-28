export const formatNumber = (num: number): string => num.toLocaleString();

export const formatScore = (score: number): string => score.toString().padStart(2, '0');
