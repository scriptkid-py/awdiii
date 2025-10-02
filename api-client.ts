// API Client for SkillShare Backend
import { UserProfile, Skill, SkillCategory, SearchFilters } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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

class ApiClient {
  private baseURL: string;
  private authToken: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Profile API methods
  async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/profiles/me');
  }

  async createUserProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/profiles', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  async updateUserProfile(profileId: string, updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>(`/profiles/${profileId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async getAllProfiles(page: number = 1, limit: number = 20): Promise<PaginatedResponse<UserProfile[]>> {
    return this.request<UserProfile[]>(`/profiles?page=${page}&limit=${limit}`);
  }

  async searchProfiles(filters: SearchFilters, page: number = 1, limit: number = 20): Promise<PaginatedResponse<UserProfile[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters.skills.length > 0) {
      filters.skills.forEach(skill => params.append('skills', skill));
    }

    if (filters.availability.length > 0) {
      filters.availability.forEach(avail => params.append('availability', avail));
    }

    if (filters.university) {
      params.append('university', filters.university);
    }

    if (filters.year) {
      params.append('year', filters.year);
    }

    if (filters.searchTerm) {
      params.append('searchTerm', filters.searchTerm);
    }

    return this.request<UserProfile[]>(`/profiles/search?${params.toString()}`);
  }

  async getProfileById(profileId: string): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>(`/profiles/${profileId}`);
  }

  // Skills API methods
  async getAllSkills(page: number = 1, limit: number = 50): Promise<PaginatedResponse<Skill[]>> {
    return this.request<Skill[]>(`/skills?page=${page}&limit=${limit}`);
  }

  async getSkillsByCategory(category: string, page: number = 1, limit: number = 50): Promise<PaginatedResponse<Skill[]>> {
    return this.request<Skill[]>(`/skills?category=${encodeURIComponent(category)}&page=${page}&limit=${limit}`);
  }

  async searchSkills(searchTerm: string, page: number = 1, limit: number = 50): Promise<PaginatedResponse<Skill[]>> {
    return this.request<Skill[]>(`/skills?search=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}`);
  }

  async createSkill(skill: Omit<Skill, 'id'>): Promise<ApiResponse<Skill>> {
    return this.request<Skill>('/skills', {
      method: 'POST',
      body: JSON.stringify(skill),
    });
  }

  async getSkillById(skillId: string): Promise<ApiResponse<Skill>> {
    return this.request<Skill>(`/skills/${skillId}`);
  }

  // Skill Categories API methods
  async getSkillCategories(page: number = 1, limit: number = 50): Promise<PaginatedResponse<SkillCategory[]>> {
    return this.request<SkillCategory[]>(`/skill-categories?page=${page}&limit=${limit}`);
  }

  async searchSkillCategories(searchTerm: string, page: number = 1, limit: number = 50): Promise<PaginatedResponse<SkillCategory[]>> {
    return this.request<SkillCategory[]>(`/skill-categories?search=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}`);
  }

  async createSkillCategory(category: Omit<SkillCategory, 'id'>): Promise<ApiResponse<SkillCategory>> {
    return this.request<SkillCategory>('/skill-categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async getSkillCategoryById(categoryId: string): Promise<ApiResponse<SkillCategory>> {
    return this.request<SkillCategory>(`/skill-categories/${categoryId}`);
  }

  // Initialize API methods
  async initializeDefaultData(): Promise<ApiResponse<any>> {
    return this.request('/initialize/default-data', {
      method: 'POST',
    });
  }

  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request('/initialize/health');
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export the class for custom instances if needed
export default ApiClient;
