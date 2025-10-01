import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, Skill, SkillCategory, UserSkill, SearchFilters } from './types';

// User Profiles
export const createUserProfile = async (profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'profiles'), {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const q = query(collection(db, 'profiles'), where('uid', '==', uid));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const doc = querySnapshot.docs[0];
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date()
  } as UserProfile;
};

export const updateUserProfile = async (profileId: string, updates: Partial<UserProfile>): Promise<void> => {
  const profileRef = doc(db, 'profiles', profileId);
  await updateDoc(profileRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const getAllProfiles = async (): Promise<UserProfile[]> => {
  const querySnapshot = await getDocs(collection(db, 'profiles'));
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    } as UserProfile;
  });
};

export const searchProfiles = async (filters: SearchFilters): Promise<UserProfile[]> => {
  let q = query(collection(db, 'profiles'));
  
  // Apply filters
  if (filters.skills.length > 0) {
    q = query(q, where('skills', 'array-contains-any', filters.skills));
  }
  
  if (filters.availability.length > 0) {
    q = query(q, where('availability', 'in', filters.availability));
  }
  
  if (filters.university) {
    q = query(q, where('university', '==', filters.university));
  }
  
  if (filters.year) {
    q = query(q, where('year', '==', filters.year));
  }
  
  const querySnapshot = await getDocs(q);
  let profiles = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    } as UserProfile;
  });
  
  // Client-side filtering for search term
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    profiles = profiles.filter(profile => 
      profile.displayName.toLowerCase().includes(searchLower) ||
      profile.bio?.toLowerCase().includes(searchLower) ||
      profile.skills.some(skill => skill.toLowerCase().includes(searchLower))
    );
  }
  
  return profiles;
};

// Skills Management
export const getAllSkills = async (): Promise<Skill[]> => {
  const querySnapshot = await getDocs(collection(db, 'skills'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Skill));
};

export const getSkillCategories = async (): Promise<SkillCategory[]> => {
  const querySnapshot = await getDocs(collection(db, 'skillCategories'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as SkillCategory));
};

export const createSkill = async (skill: Omit<Skill, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'skills'), skill);
  return docRef.id;
};

export const createSkillCategory = async (category: Omit<SkillCategory, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'skillCategories'), category);
  return docRef.id;
};

// Initialize default skills and categories
export const initializeDefaultData = async (): Promise<void> => {
  // Check if skills already exist
  const skillsSnapshot = await getDocs(collection(db, 'skills'));
  if (skillsSnapshot.empty) {
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
    
    for (const skill of defaultSkills) {
      await createSkill(skill);
    }
  }
  
  // Check if categories already exist
  const categoriesSnapshot = await getDocs(collection(db, 'skillCategories'));
  if (categoriesSnapshot.empty) {
    const defaultCategories = [
      { name: 'Programming', description: 'Software development and coding' },
      { name: 'Data Science', description: 'Data analysis and machine learning' },
      { name: 'Creative', description: 'Art, design, and creative skills' },
      { name: 'Communication', description: 'Speaking, writing, and language skills' },
      { name: 'Academic', description: 'Academic subjects and research' },
      { name: 'Business', description: 'Business and entrepreneurship skills' },
      { name: 'Technical', description: 'Technical and engineering skills' }
    ];
    
    for (const category of defaultCategories) {
      await createSkillCategory(category);
    }
  }
};
