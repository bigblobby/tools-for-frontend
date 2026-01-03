/**
 * Checks if a string is like a hex color (missing #)
 * @param str
 * @return boolean
 */
export function isHexLikeColor(str: string): boolean {
  return /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(str);
}