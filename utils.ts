// Utility functions for the SkillShare application

/**
 * Generate Gravatar URL from email address
 * @param email - User's email address
 * @param size - Image size in pixels (default: 200)
 * @returns Gravatar URL with identicon fallback
 */
export const getGravatarUrl = (email: string, size: number = 200): string => {
  // Simple hash function for Gravatar (for demo purposes)
  // In production, you'd want to use a proper MD5 library
  const hash = email.toLowerCase().trim().split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
  return `https://www.gravatar.com/avatar/${hexHash}?s=${size}&d=identicon`;
};

/**
 * Get profile picture URL with email-based fallback
 * @param photoURL - User's existing photo URL (from Google/Firebase)
 * @param email - User's email address for Gravatar fallback
 * @param size - Image size in pixels (default: 200)
 * @returns Profile picture URL
 */
export const getProfilePictureUrl = (photoURL?: string, email?: string, size: number = 200): string => {
  // Use Firebase photoURL if available, otherwise fall back to Gravatar
  if (photoURL && photoURL.trim()) {
    return photoURL;
  }
  return getGravatarUrl(email || 'user@example.com', size);
};
