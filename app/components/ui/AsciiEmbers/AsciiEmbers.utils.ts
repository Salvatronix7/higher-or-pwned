import { DEFAULT_CHARSET } from './AsciiEmbers.constants';

export const resolveCharset = (charset?: string) => {
  if (charset && charset.length > 0) {
    return charset;
  }

  return DEFAULT_CHARSET;
};
