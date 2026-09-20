/**
 * ============================================================================
 * PAYPULSE ENTERPRISE — USER & PROFILE UTILITIES
 * ============================================================================
 * Helper functions for parsing operator profiles, formatting names, and
 * extracting initials for visual avatar tokens.
 * ============================================================================
 */

/**
 * Extracts a concise 1-2 letter uppercase initials representation from a user name.
 * 
 * @param name - The full name string (e.g. 'Maya Chen' -> 'MC', 'Admin' -> 'AD')
 * @returns A 1-2 character uppercase string suitable for avatar placeholders
 */
export const getInitials = (name?: string): string => {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].substring(0, Math.min(2, parts[0].length)).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
