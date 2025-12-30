// src/auth/util/time.util.ts

/**
 * Parses a JWT expiresIn string (e.g., "30d", "1h") into milliseconds.
 * @param expiresIn The string to parse.
 * @returns The equivalent duration in milliseconds.
 */
export function parseExpiresInToMs(expiresIn: string): number {
  const value = parseInt(expiresIn.slice(0, -1));
  const unit = expiresIn.slice(-1);

  if (isNaN(value)) {
    return parseInt(expiresIn); // Assume it's already in ms if parsing fails
  }

  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return parseInt(expiresIn); // Fallback for plain numbers
  }
}
