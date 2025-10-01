import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { UserProfile, Skill, SkillCategory } from './types';
import { 
  getUserProfile, 
  createUserProfile, 
  updateUserProfile, 
  getAllSkills, 
  getSkillCategories,
  initializeDefaultData 
} from './database';

interface ProfileManagerProps {
  onProfileComplete: (profile: UserProfile) => void;
}

const ProfileManager: React.FC<ProfileManagerProps> = ({ onProfileComplete }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    major: '',
    university: '',
    year: '',
    skills: [] as string[],
    interests: [] as string[],
    availability: 'available' as const
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Initialize default data
        await initializeDefaultData();
        
        // Load user profile
        const userProfile = await getUserProfile(user.uid);
        if (userProfile) {
          setProfile(userProfile);
          setFormData({
            displayName: userProfile.displayName,
            bio: userProfile.bio || '',
            major: userProfile.major || '',
            university: userProfile.university || '',
            year: userProfile.year || '',
            skills: userProfile.skills,
            interests: userProfile.interests,
            availability: userProfile.availability
          });
        } else {
          // Set default values for new profile
          setFormData(prev => ({
            ...prev,
            displayName: user.displayName || '',
            email: user.email || ''
          }));
        }
        
        // Load skills and categories
        const [skillsData, categoriesData] = await Promise.all([
          getAllSkills(),
          getSkillCategories()
        ]);
        setSkills(skillsData);
        setCategories(categoriesData);
        
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillToggle = (skillName: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillName)
        ? prev.skills.filter(s => s !== skillName)
        : [...prev.skills, skillName]
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      
      const profileData = {
        uid: user.uid,
        displayName: formData.displayName,
        email: user.email || '',
        photoURL: user.photoURL || undefined,
        bio: formData.bio,
        major: formData.major,
        university: formData.university,
        year: formData.year,
        skills: formData.skills,
        interests: formData.interests,
        availability: formData.availability
      };

      if (profile) {
        // Update existing profile
        await updateUserProfile(profile.id, profileData);
        const updatedProfile = await getUserProfile(user.uid);
        if (updatedProfile) {
          setProfile(updatedProfile);
          onProfileComplete(updatedProfile);
        }
      } else {
        // Create new profile
        const profileId = await createUserProfile(profileData);
        const newProfile: UserProfile = {
          id: profileId,
          ...profileData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setProfile(newProfile);
        onProfileComplete(newProfile);
      }
      
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-manager">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Loading your profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-manager">
      <div className="create-profile-page">
        <h1>{profile ? 'Edit Your Profile' : 'Create Your Profile'}</h1>
        <p>Tell us about yourself and your skills to connect with others!</p>
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="displayName">Full Name *</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="major">Major/Field of Study</label>
            <input
              type="text"
              id="major"
              name="major"
              value={formData.major}
              onChange={handleInputChange}
              placeholder="e.g., Computer Science, Business, Art"
            />
          </div>

          <div className="form-group">
            <label htmlFor="university">University/School</label>
            <input
              type="text"
              id="university"
              name="university"
              value={formData.university}
              onChange={handleInputChange}
              placeholder="e.g., Stanford University"
            />
          </div>

          <div className="form-group">
            <label htmlFor="year">Academic Year</label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
            >
              <option value="">Select year</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Graduate">Graduate</option>
              <option value="Alumni">Alumni</option>
            </select>
          </div>

          <div className="form-group">
            <label>Skills *</label>
            <p>Select the skills you have or want to learn:</p>
            <div className="skills-grid">
              {skills.map(skill => (
                <label key={skill.id} className="skill-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill.name)}
                    onChange={() => handleSkillToggle(skill.name)}
                  />
                  <span className="skill-tag">
                    {skill.name}
                    <small>({skill.category})</small>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Interests</label>
            <p>What are you interested in learning or teaching?</p>
            <div className="interests-grid">
              {categories.map(category => (
                <label key={category.id} className="interest-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(category.name)}
                    onChange={() => handleInterestToggle(category.name)}
                  />
                  <span className="skill-tag">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="availability">Availability</label>
            <select
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
            >
              <option value="available">Available for collaboration</option>
              <option value="busy">Busy but open to opportunities</option>
              <option value="unavailable">Currently unavailable</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="button"
            disabled={saving || formData.skills.length === 0}
          >
            {saving ? 'Saving...' : (profile ? 'Update Profile' : 'Create Profile')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileManager;
