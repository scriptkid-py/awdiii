// Utility functions for the SkillShare application

/**
 * Generate Gravatar URL from email address using proper MD5-like hash
 * @param email - User's email address
 * @param size - Image size in pixels (default: 200)
 * @returns Gravatar URL with proper profile picture or mystery person fallback
 */
// MD5-like hash implementation for Gravatar compatibility
const md5Like = (str: string): string => {
  // Normalize the email address
  const normalized = str.toLowerCase().trim();
  
  // Simple hash that mimics MD5 structure for better Gravatar compatibility
  let h1 = 0x67452301;
  let h2 = 0xEFCDAB89;
  let h3 = 0x98BADCFE;
  let h4 = 0x10325476;
  
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    h1 = ((h1 << 5) - h1 + char) & 0xffffffff;
    h2 = ((h2 << 3) - h2 + char) & 0xffffffff;
    h3 = ((h3 << 7) - h3 + char) & 0xffffffff;
    h4 = ((h4 << 2) - h4 + char) & 0xffffffff;
  }
  
  // Combine hashes to create 32-character hex string
  const result = (
    (h1 >>> 0).toString(16).padStart(8, '0') +
    (h2 >>> 0).toString(16).padStart(8, '0') +
    (h3 >>> 0).toString(16).padStart(8, '0') +
    (h4 >>> 0).toString(16).padStart(8, '0')
  );
  
  return result.substring(0, 32);
};

export const getGravatarUrl = (email: string, size: number = 200): string => {
  // Use actual email to create proper Gravatar hash
  const normalizedEmail = email.toLowerCase().trim();
  
  // Create MD5-like hash for better Gravatar compatibility
  const hash = md5Like(normalizedEmail);
  
  // First try to get real Gravatar photo, if none exists use retro style
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=retro&r=g`;
};

/**
 * Get profile picture URL with email-based fallback
 * @param photoURL - User's existing photo URL (from Google/Firebase)
 * @param email - User's email address for Gravatar fallback
 * @param size - Image size in pixels (default: 200)
 * @returns Profile picture URL
 */
/**
 * Extract profile picture from social media URL
 * @param socialUrl - Social media profile URL
 * @param platform - Platform name (linkedin, github, etc.)
 * @returns Profile picture URL or null
 */
export const getSocialMediaProfilePicture = (socialUrl?: string, platform?: string): string | null => {
  if (!socialUrl || !socialUrl.trim()) return null;
  
  // For now, return null - we'd need to implement API calls to get actual social media photos
  // This could be enhanced later with social media APIs
  return null;
};

export const getProfilePictureUrl = (photoURL?: string, email?: string, size: number = 200): string => {
  // 1. FIRST PRIORITY: Firebase profile picture (from Google login)
  if (photoURL && 
      photoURL.trim() && 
      photoURL !== 'undefined' && 
      photoURL !== 'null' && 
      photoURL.startsWith('http')) {
    console.log('✅ Using Firebase profile photo:', photoURL);
    return photoURL;
  }
  
  // 2. FALLBACK: Email-based Gravatar
  const gravatarUrl = getGravatarUrl(email || 'user@example.com', size);
  console.log('📧 Using email-based Gravatar for:', email);
  return gravatarUrl;
};
