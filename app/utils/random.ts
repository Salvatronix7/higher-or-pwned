import { PASSWORD_LIST } from '~/constants';

export const getRandomPassword = (exclude: readonly string[] = []): string => {
  const available = PASSWORD_LIST.filter((p) => !exclude.includes(p));
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex] ?? PASSWORD_LIST[0] ?? '123456';
};

export const getRandomItem = <T>(items: readonly T[]): T => {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex] as T;
};
