// Shared types for the backend API
export interface UserProfile {
  id?: string;
  uid: string;
  displayName: string;
  email: string;
  bio?: string;
  skills: string[];
  interests?: string[];
  availability: string[];
  university?: string;
  year?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    social?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
    };
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Skill {
  id?: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  description?: string;
}

export interface SkillCategory {
  id?: string;
  name: string;
  description?: string;
}

export interface SearchFilters {
  skills: string[];
  availability: string[];
  university?: string;
  year?: string;
  searchTerm?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
