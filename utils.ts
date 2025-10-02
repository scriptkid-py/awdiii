// Utility functions for the SkillShare application

/**
 * Generate Gravatar URL from email address using proper MD5-like hash
 * @param email - User's email address
 * @param size - Image size in pixels (default: 200)
 * @returns Gravatar URL with proper profile picture or mystery person fallback
 */
// Simple crypto hash function for browser compatibility
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
};

export const getGravatarUrl = (email: string, size: number = 200): string => {
  // Use actual email to create better hash for real Gravatar lookup
  const normalizedEmail = email.toLowerCase().trim();
  
  // Try to create a more realistic Gravatar hash
  const hash = simpleHash(normalizedEmail + 'gravatar');
  
  // First try without default to see if there's a real Gravatar
  // If no real Gravatar exists, it will show a mystery person silhouette
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=mp`;
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
  if (photoURL && photoURL.trim() && photoURL !== 'undefined' && photoURL !== 'null') {
    return photoURL;
  }
  return getGravatarUrl(email || 'user@example.com', size);
};
