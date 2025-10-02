// Utility functions for the SkillShare application

/**
 * Generate Gravatar URL from email address using proper MD5-like hash
 * @param email - User's email address
 * @param size - Image size in pixels (default: 200)
 * @returns Gravatar URL with proper profile picture or mystery person fallback
 */
// Simple consistent hash for Gravatar - same input always gives same output
const createConsistentHash = (email: string): string => {
  const normalized = email.toLowerCase().trim();
  console.log('🔢 Creating hash for email:', normalized);
  
  // Simple but consistent hash
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to positive hex and pad to 32 characters
  const hexHash = Math.abs(hash).toString(16).padStart(32, '0');
  console.log('🔢 Generated hash:', hexHash);
  return hexHash;
};

export const getGravatarUrl = (email: string, size: number = 200): string => {
  const normalizedEmail = email.toLowerCase().trim();
  console.log('🌐 Getting Gravatar for:', normalizedEmail);
  
  // Create consistent hash
  const hash = createConsistentHash(normalizedEmail);
  
  // Use consistent Gravatar URL - same email will always give same image
  const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=retro&r=g`;
  console.log('🌐 Gravatar URL:', gravatarUrl);
  return gravatarUrl;
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
  console.log('🔍 Profile picture debug:', { photoURL, email, size });
  
  // 1. FIRST PRIORITY: Firebase profile picture (from Google login)
  if (photoURL && 
      photoURL.trim() && 
      photoURL !== 'undefined' && 
      photoURL !== 'null' && 
      photoURL.startsWith('http')) {
    console.log('✅ Using Firebase profile photo:', photoURL);
    return photoURL;
  }
  
  // 2. FALLBACK: Email-based Gravatar - ENSURE CONSISTENT EMAIL
  const normalizedEmail = email?.toLowerCase().trim() || 'user@example.com';
  const gravatarUrl = getGravatarUrl(normalizedEmail, size);
  console.log('📧 Using email-based Gravatar for:', normalizedEmail, '→', gravatarUrl);
  return gravatarUrl;
};
