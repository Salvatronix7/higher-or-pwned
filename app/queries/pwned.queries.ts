import { useQuery } from '@tanstack/react-query';
import { pwnedApi } from '~/api';
import { queryKeys } from './keys';

export const usePwnedCount = (password: string) =>
  useQuery({
    queryKey: queryKeys.pwned.password(password),
    queryFn: ({ signal }) => pwnedApi.getPwnedCount(password, signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: password.length > 0,
  });
