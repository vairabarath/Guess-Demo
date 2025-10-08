import { web3 } from "../config/web3";

export const ZERO_HASH =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

/**
 * Removes the '0x' prefix from a hex string if it exists.
 */
export const removePrefix = (hex: string): string => {
  return hex.startsWith("0x") ? hex.slice(2) : hex;
};

/**
 * Validates if a string is a 64-character hexadecimal string.
 */
export const validateHashFormat = (hex: string): boolean => {
  const cleanedHex = removePrefix(hex);
  return /^[0-9a-fA-F]{64}$/.test(cleanedHex);
};

/**
 * Generates a keccak256 hash from a given string input.
 */
export const genHashData = (inputValue: string): string => {
  return web3.utils.keccak256(inputValue);
};

/**
 * Generates the dummy hash by combining the actual hash and secret key.
 */
export const getUnrevealedHash = (
  actualHash: string,
  secretKey: string
): string => {
  const encodedParams = web3.eth.abi.encodeParameters(
    ["bytes32", "bytes32"],
    [actualHash, secretKey]
  );
  return web3.utils.keccak256(encodedParams);
};

/**
 * Splits a hex string into smaller substrings (tokens) of a specified size.
 */
export const tokenize = (hex: string, tokenSize: number): string[] => {
  const tokens: string[] = [];
  const cleanedHex = removePrefix(hex);
  if (cleanedHex.length < tokenSize) return [];

  for (let i = 0; i <= cleanedHex.length - tokenSize; i++) {
    tokens.push(cleanedHex.slice(i, i + tokenSize));
  }
  return tokens;
};
