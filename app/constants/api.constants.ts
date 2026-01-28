export const API = {
  HIBP_BASE_URL: 'https://api.pwnedpasswords.com',
  HIBP_RANGE_ENDPOINT: '/range/',
} as const;

export const API_HEADERS = {
  ADD_PADDING: 'Add-Padding',
  TRUE: 'true',
} as const;

export const CRYPTO = {
  SHA1_ALGORITHM: 'SHA-1',
  HASH_PREFIX_LENGTH: 5,
} as const;
