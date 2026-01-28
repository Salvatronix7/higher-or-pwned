import { getRandomPassword } from '~/utils';
import type { Password } from '~/types';

export const createInitialPassword = (exclude: readonly string[] = []): Password => ({
  value: getRandomPassword(exclude),
  pwnedCount: null,
  roundsStayed: 0,
});
