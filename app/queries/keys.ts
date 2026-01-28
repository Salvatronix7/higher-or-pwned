export const queryKeys = {
  pwned: {
    all: ['pwned'] as const,
    password: (password: string) => [...queryKeys.pwned.all, password] as const,
  },
} as const;
