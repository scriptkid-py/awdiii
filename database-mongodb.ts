import { connectToDatabase, getCollections } from './mongodb';
import { UserProfile, Skill, SkillCategory, SearchFilters } from './types';

// User Profiles
export const createUserProfile = async (profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  await connectToDatabase();
  const { profiles } = getCollections();
  
  const profileData = {
    ...profile,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const result = await profiles.insertOne(profileData);
  return result.insertedId || 'mock-id';
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  await connectToDatabase();
  const { profiles } = getCollections();
  
  const profile = await profiles.findOne({ uid });
  
  if (!profile) {
    return null;
  }
  
  return {
    id: (profile as any)._id?.toString() || 'mock-id',
    ...profile,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt
  } as UserProfile;
};

export const updateUserProfile = async (profileId: string, updates: Partial<UserProfile>): Promise<void> => {
  await connectToDatabase();
  const { profiles } = getCollections();
  
  const updateData = {
    ...updates,
    updatedAt: new Date()
  };
  
  await profiles.updateOne(
    { _id: profileId },
    { $set: updateData }
  );
};

export const getAllProfiles = async (): Promise<UserProfile[]> => {
  await connectToDatabase();
  const { profiles } = getCollections();
  
  const profilesList = await profiles.find({}).toArray();
  
  return profilesList.map(profile => ({
    id: (profile as any)._id?.toString() || 'mock-id',
    ...profile,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt
  })) as UserProfile[];
};

export const searchProfiles = async (filters: SearchFilters): Promise<UserProfile[]> => {
  await connectToDatabase();
  const { profiles } = getCollections();
  
  // Build MongoDB query
  const query: any = {};
  
  if (filters.skills.length > 0) {
    query.skills = { $in: filters.skills };
  }
  
  if (filters.availability.length > 0) {
    query.availability = { $in: filters.availability };
  }
  
  if (filters.university) {
    query.university = filters.university;
  }
  
  if (filters.year) {
    query.year = filters.year;
  }
  
  let profilesList = await profiles.find(query).toArray();
  
  // Client-side filtering for search term
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    profilesList = profilesList.filter(profile => 
      profile.displayName.toLowerCase().includes(searchLower) ||
      profile.bio?.toLowerCase().includes(searchLower) ||
      profile.skills.some((skill: string) => skill.toLowerCase().includes(searchLower))
    );
  }
  
  return profilesList.map(profile => ({
    id: (profile as any)._id?.toString() || 'mock-id',
    ...profile,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt
  })) as UserProfile[];
};

// Skills Management
export const getAllSkills = async (): Promise<Skill[]> => {
  await connectToDatabase();
  const { skills } = getCollections();
  
  const skillsList = await skills.find({}).toArray();
  
  return skillsList.map(skill => ({
    id: (skill as any)._id?.toString() || 'mock-id',
    ...skill
  })) as Skill[];
};

export const getSkillCategories = async (): Promise<SkillCategory[]> => {
  await connectToDatabase();
  const { skillCategories } = getCollections();
  
  const categoriesList = await skillCategories.find({}).toArray();
  
  return categoriesList.map(category => ({
    id: (category as any)._id?.toString() || 'mock-id',
    ...category
  })) as SkillCategory[];
};

export const createSkill = async (skill: Omit<Skill, 'id'>): Promise<string> => {
  await connectToDatabase();
  const { skills } = getCollections();
  
  const result = await skills.insertOne(skill);
  return result.insertedId.toString();
};

export const createSkillCategory = async (category: Omit<SkillCategory, 'id'>): Promise<string> => {
  await connectToDatabase();
  const { skillCategories } = getCollections();
  
  const result = await skillCategories.insertOne(category);
  return result.insertedId.toString();
};

// Initialize default skills and categories
export const initializeDefaultData = async (): Promise<void> => {
  await connectToDatabase();
  const { skills, skillCategories } = getCollections();
  
  // Check if skills already exist
  const skillsCount = await skills.countDocuments();
  if (skillsCount === 0) {
    const defaultSkills = [
      { name: 'JavaScript', category: 'Programming', level: 'intermediate' as const, description: 'Web development with JavaScript' },
      { name: 'React', category: 'Programming', level: 'intermediate' as const, description: 'React library for building user interfaces' },
      { name: 'Python', category: 'Programming', level: 'intermediate' as const, description: 'Python programming language' },
      { name: 'Machine Learning', category: 'Data Science', level: 'advanced' as const, description: 'Machine learning algorithms and techniques' },
      { name: 'Design', category: 'Creative', level: 'intermediate' as const, description: 'UI/UX design principles' },
      { name: 'Photography', category: 'Creative', level: 'beginner' as const, description: 'Digital photography techniques' },
      { name: 'Public Speaking', category: 'Communication', level: 'intermediate' as const, description: 'Effective public speaking skills' },
      { name: 'Writing', category: 'Communication', level: 'intermediate' as const, description: 'Technical and creative writing' },
      { name: 'Mathematics', category: 'Academic', level: 'advanced' as const, description: 'Advanced mathematics and statistics' },
      { name: 'Languages', category: 'Communication', level: 'intermediate' as const, description: 'Foreign language proficiency' }
    ];
    
    await skills.insertMany(defaultSkills);
  }
  
  // Check if categories already exist
  const categoriesCount = await skillCategories.countDocuments();
  if (categoriesCount === 0) {
    const defaultCategories = [
      { name: 'Programming', description: 'Software development and coding' },
      { name: 'Data Science', description: 'Data analysis and machine learning' },
      { name: 'Creative', description: 'Art, design, and creative skills' },
      { name: 'Communication', description: 'Speaking, writing, and language skills' },
      { name: 'Academic', description: 'Academic subjects and research' },
      { name: 'Business', description: 'Business and entrepreneurship skills' },
      { name: 'Technical', description: 'Technical and engineering skills' }
    ];
    
    await skillCategories.insertMany(defaultCategories);
  }
};
