/**
 * Base62 encoding for URL shortening
 * Uses: 0-9, a-z, A-Z (62 characters)
 */
const BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE = BASE62_CHARS.length;

/**
 * Convert a number to base62 string
 * @param num - The number to encode
 * @returns Base62 encoded string
 */
export const encodeBase62 = (num: number): string => {
  if (num === 0) return BASE62_CHARS[0];

  let encoded = "";
  let n = num;

  while (n > 0) {
    encoded = BASE62_CHARS[n % BASE] + encoded;
    n = Math.floor(n / BASE);
  }

  return encoded;
};

/**
 * Convert a base62 string back to number
 * @param str - The base62 string to decode
 * @returns Decoded number
 */
export const decodeBase62 = (str: string): number => {
  let decoded = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const value = BASE62_CHARS.indexOf(char);

    if (value === -1) {
      throw new Error(`Invalid character in base62 string: ${char}`);
    }

    decoded = decoded * BASE + value;
  }

  return decoded;
};

/**
 * Generate short code from database ID
 * Adds offset to avoid very short codes
 * @param id - Database ID
 * @returns Short code
 */
export const generateShortCode = (id: number): string => {
  const OFFSET = 100000;
  return encodeBase62(id + OFFSET);
};

/**
 * Generate a random short code
 * Used for custom aliases or as fallback
 * @param length - Length of the code (default 6)
 * @returns Random short code
 */
export const generateRandomCode = (length: number = 6): string => {
  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * BASE);
    code += BASE62_CHARS[randomIndex];
  }
  return code;
};

/**
 * Validate short code format
 * @param code - Short code to validate
 * @returns True if valid
 */
export const isValidShortCode = (code: string): boolean => {
  if (!code || code.length < 1 || code.length > 10) {
    return false;
  }

  for (const char of code) {
    if (!BASE62_CHARS.includes(char)) {
      return false;
    }
  }

  return true;
};
