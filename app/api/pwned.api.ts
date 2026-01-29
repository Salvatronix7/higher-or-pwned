import { getPasswordHash } from '~/utils';
import { API, API_HEADERS } from '~/constants';

interface PwnedRangeResult {
  readonly suffix: string;
  readonly count: number;
}

const parseRangeResponse = (response: string): readonly PwnedRangeResult[] =>
  response
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const [suffix, countStr] = line.split(':');
      return {
        suffix: suffix?.trim() ?? '',
        count: parseInt(countStr?.trim() ?? '0', 10),
      };
    });

const fetchPwnedRange = async (
  prefix: string,
  signal?: AbortSignal
): Promise<readonly PwnedRangeResult[]> => {
  const response = await fetch(`${API.HIBP_BASE_URL}${API.HIBP_RANGE_ENDPOINT}${prefix}`, {
    headers: {
      [API_HEADERS.ADD_PADDING]: API_HEADERS.TRUE,
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`HIBP API error: ${response.status}`);
  }

  const text = await response.text();
  return parseRangeResponse(text);
};

export const getPwnedCount = async (
  password: string,
  signal?: AbortSignal
): Promise<number> => {
  const { prefix, suffix } = await getPasswordHash(password);
  const results = await fetchPwnedRange(prefix, signal);
  const match = results.find(
    (r) => r.suffix.toUpperCase() === suffix.toUpperCase()
  );
  return match?.count ?? 0;
};

export const pwnedApi = {
  getPwnedCount,
} as const;
