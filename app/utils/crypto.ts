import { CRYPTO } from '~/constants';

const sha1 = async (message: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest(CRYPTO.SHA1_ALGORITHM, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex.toUpperCase();
};

export const getPasswordHash = async (
  password: string
): Promise<{ prefix: string; suffix: string }> => {
  const hash = await sha1(password);
  return {
    prefix: hash.slice(0, CRYPTO.HASH_PREFIX_LENGTH),
    suffix: hash.slice(CRYPTO.HASH_PREFIX_LENGTH),
  };
};
