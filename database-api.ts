// Database operations using API client instead of direct MongoDB
import { apiClient } from './api-client';
import { UserProfile, Skill, SkillCategory, SearchFilters } from './types';

// Mock state manager interface for compatibility with existing code
export interface MockStateManager {
  getState: () => any;
  incrementAttempts: () => void;
  setConnectionStatus: (status: string) => void;
  setLastError: (error?: string) => void;
}

// User Profiles
export const createUserProfile = async (
  profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>, 
  stateManager?: MockStateManager
): Promise<string> => {
  try {
    const response = await apiClient.createUserProfile(profile);
    if (response.success && response.data) {
      return response.data.id || 'created';
    }
    throw new Error(response.error || 'Failed to create profile');
  } catch (error) {
    if (stateManager) {
      stateManager.setLastError(error instanceof Error ? error.message : String(error));
    }
    throw error;
  }
};

export const getUserProfile = async (
  uid: string, 
  stateManager?: MockStateManager
): Promise<UserProfile | null> => {
  try {
    const response = await apiClient.getUserProfile();
    if (response.success && response.data) {
      return response.data;
    }
    if (response.error?.includes('not found')) {
      return null;
    }
    throw new Error(response.error || 'Failed to get profile');
  } catch (error) {
    if (stateManager) {
      stateManager.setLastError(error instanceof Error ? error.message : String(error));
    }
    // Return null for not found errors to maintain compatibility
    if (error instanceof Error && error.message.includes('not found')) {
      return null;
    }
    throw error;
  }
};

export const updateUserProfile = async (
  profileId: string, 
  updates: Partial<UserProfile>, 
  stateManager?: MockStateManager
): Promise<void> => {
  try {
    const response = await apiClient.updateUserProfile(profileId, updates);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update profile');
    }
  } catch (error) {
    if (stateManager) {
      stateManager.setLastError(error instanceof Error ? error.message : String(error));
    }
    throw error;
  }
};

export const getAllProfiles = async (stateManager?: MockStateManager): Promise<UserProfile[]> => {
  try {
    const response = await apiClient.getAllProfiles(1, 100); // Get first 100 profiles
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to get profiles');
  } catch (error) {
    if (stateManager) {
      stateManager.setLastError(error instanceof Error ? error.message : String(error));
    }
    throw error;
  }
};

export const searchProfiles = async (
  filters: SearchFilters, 
  stateManager?: MockStateManager
): Promise<UserProfile[]> => {
  try {
    const response = await apiClient.searchProfiles(filters, 1, 100); // Get first 100 results
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to search profiles');
  } catch (error) {
    if (stateManager) {
      stateManager.setLastError(error instanceof Error ? error.message : String(error));
    }
    throw error;
  }
};

// Skills Management
export const getAllSkills = async (stateManager?: MockStateManager): Promise<Skill[]> => {
  try {
    const response = await apiClient.getAllSkills(1, 100); // Get first 100 skills
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to get skills');
  } catch (error) {
    if (stateManager) {
      stateManager.setLastError(error instanceof Error ? error.message : String(error));
    }
    throw error;
  }
};

export const getSkillCategories = async (stateManager?: MockStateManager): Promise<SkillCategory[]> => {
  try {
    const response = await apiClient.getSkillCategories(1, 100); // Get first 100 categories
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to get skill categories');
  } catch (error) {
    if (stateManager) {
      stateManager.setLastError(error instanceof Error ? error.message : String(error));
    }
    throw error;
  }
};

export const createSkill = async (
  skill: Omit<Skill, 'id'>, 
  stateManager?: MockStateManager
): Promise<string> => {
  try {
    const response = await apiClient.createSkill(skill);
    if (response.success && response.data) {
      return response.data.id || 'created';
    }
    throw new Error(response.error || 'Failed to create skill');
  } catch (error) {
    if (stateManager) {
      stateManager.setLastError(error instanceof Error ? error.message : String(error));
    }
    throw error;
  }
};

export const createSkillCategory = async (
  category: Omit<SkillCategory, 'id'>, 
  stateManager?: MockStateManager
): Promise<string> => {
  try {
    const response = await apiClient.createSkillCategory(category);
    if (response.success && response.data) {
      return response.data.id || 'created';
    }
    throw new Error(response.error || 'Failed to create skill category');
  } catch (error) {
    if (stateManager) {
      stateManager.setLastError(error instanceof Error ? error.message : String(error));
    }
    throw error;
  }
};

// Initialize default skills and categories
export const initializeDefaultData = async (stateManager?: MockStateManager): Promise<void> => {
  try {
    const response = await apiClient.initializeDefaultData();
    if (!response.success) {
      throw new Error(response.error || 'Failed to initialize default data');
    }
    console.log('✅ Default data initialized:', response.data);
  } catch (error) {
    if (stateManager) {
      stateManager.setLastError(error instanceof Error ? error.message : String(error));
    }
    throw error;
  }
};

// Connection management (for compatibility with existing code)
export const connectToDatabase = async (stateManager?: MockStateManager): Promise<boolean> => {
  try {
    if (stateManager) {
      stateManager.setConnectionStatus('connecting');
      stateManager.incrementAttempts();
    }
    
    console.log('🔌 Connecting to backend API...');
    
    // Test the connection with a health check
    const response = await apiClient.healthCheck();
    
    if (response.success) {
      if (stateManager) {
        stateManager.setConnectionStatus('connected');
        stateManager.setLastError(undefined);
      }
      console.log('✅ Successfully connected to backend API!');
      console.log('📊 API operations are now available');
      return true;
    } else {
      throw new Error(response.error || 'Health check failed');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Failed to connect to backend API:', error);
    if (stateManager) {
      stateManager.setConnectionStatus('error');
      stateManager.setLastError(errorMessage);
    }
    return false;
  }
};
