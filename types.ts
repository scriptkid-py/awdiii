export interface UserProfile {
  id: string;
  uid: string; // Firebase Auth UID
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  major?: string;
  university?: string;
  year?: string;
  skills: string[];
  interests: string[];
  availability: 'available' | 'busy' | 'unavailable';
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  description?: string;
}

export interface UserSkill {
  skillId: string;
  skillName: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  experience: string; // e.g., "2 years", "6 months"
  description?: string;
}

export interface SearchFilters {
  skills: string[];
  categories: string[];
  availability: string[];
  university?: string;
  year?: string;
  searchTerm?: string;
}
