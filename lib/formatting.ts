/**
 * Format a number for Norwegian locale display
 * @param num - The number to format
 * @returns Formatted string with Norwegian thousand separators, no decimals
 */
export function formatNumber(num: number): string {
  return Math.round(num).toLocaleString('no-NO', { maximumFractionDigits: 0 });
}

/**
 * Parse a Norwegian formatted number string to a number
 * @param str - String potentially containing spaces as thousand separators
 * @returns The parsed number
 */
export function parseNorwegianNumber(str: string): number {
  return Number(str.replace(/\s/g, ''));
}
