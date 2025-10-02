import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { UserProfile, Skill } from './types';
import { createUserProfile, updateUserProfile, getAllSkills } from './database-api';

interface CreateProfileProps {
  onProfileComplete: (profile: UserProfile) => void;
  existingProfile?: UserProfile | null;
  isEditMode?: boolean;
}

const CreateProfile: React.FC<CreateProfileProps> = ({ onProfileComplete, existingProfile, isEditMode = false }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    displayName: '',
    university: '',
    selectedSkills: [] as string[],
    bio: '',
    contactInfo: {
      email: '',
      social: {
        linkedin: '',
        instagram: ''
      }
    },
    availability: [] as string[],
    interests: [] as string[]
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Load available skills
        const skillsData = await getAllSkills();
        setSkills(skillsData);
        
        // Set default values from existing profile or user data
        if (existingProfile && isEditMode) {
          setFormData({
            displayName: existingProfile.displayName || '',
            university: existingProfile.university || '',
            selectedSkills: existingProfile.skills || [],
            bio: existingProfile.bio || '',
            contactInfo: {
              email: existingProfile.contactInfo?.email || existingProfile.email || '',
              social: {
                linkedin: existingProfile.contactInfo?.social?.linkedin || '',
                instagram: existingProfile.contactInfo?.social?.instagram || ''
              }
            },
            availability: existingProfile.availability || [],
            interests: existingProfile.interests || []
          });
        } else {
          setFormData(prev => ({
            ...prev,
            displayName: user.displayName || '',
            contactInfo: {
              ...prev.contactInfo,
              email: user.email || ''
            }
          }));
        }
        
      } catch (error) {
        console.error('Error loading skills:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, existingProfile, isEditMode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Full name is required';
    }
    
    if (!formData.university.trim()) {
      newErrors.university = 'University is required';
    }
    
    if (formData.selectedSkills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }
    
    // Validate URLs if provided
    if (formData.contactInfo.social.linkedin && !isValidUrl(formData.contactInfo.social.linkedin)) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL';
    }
    
    if (formData.contactInfo.social.instagram && !isValidUrl(formData.contactInfo.social.instagram)) {
      newErrors.instagram = 'Please enter a valid Instagram URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      setFormData(prev => {
        const parentObj = prev[parent as keyof typeof prev] as any;
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: grandchild ? {
              ...(parentObj[child] || {}),
              [grandchild]: value
            } : value
          }
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSkillToggle = (skillName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skillName)
        ? prev.selectedSkills.filter(s => s !== skillName)
        : [...prev.selectedSkills, skillName]
    }));
    
    if (errors.skills) {
      setErrors(prev => ({ ...prev, skills: '' }));
    }
  };

  const handleAvailabilityToggle = (availability: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(availability)
        ? prev.availability.filter(a => a !== availability)
        : [...prev.availability, availability]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validateForm()) return;

    try {
      setSaving(true);
      
      const profileData = {
        uid: user.uid,
        displayName: formData.displayName,
        email: user.email || '',
        bio: formData.bio,
        skills: formData.selectedSkills,
        availability: formData.availability,
        university: formData.university,
        interests: formData.interests,
        contactInfo: {
          email: formData.contactInfo.email,
          social: {
            linkedin: formData.contactInfo.social.linkedin || undefined,
            instagram: formData.contactInfo.social.instagram || undefined
          }
        }
      };

      if (isEditMode && existingProfile) {
        // Update existing profile
        await updateUserProfile(existingProfile.id, profileData);
        const updatedProfile: UserProfile = {
          ...existingProfile,
          ...profileData,
          updatedAt: new Date()
        };
        
        setSuccess(true);
        
        // Show success message for 2 seconds, then redirect
        setTimeout(() => {
          onProfileComplete(updatedProfile);
        }, 2000);
      } else {
        // Create new profile
        const profileId = await createUserProfile(profileData);
        const newProfile: UserProfile = {
          id: profileId,
          ...profileData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setSuccess(true);
        
        // Show success message for 2 seconds, then redirect
        setTimeout(() => {
          onProfileComplete(newProfile);
        }, 2000);
      }
      
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} profile:`, error);
      setErrors({ submit: `Failed to ${isEditMode ? 'update' : 'create'} profile. Please try again.` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Profile {isEditMode ? 'Updated' : 'Created'} Successfully!
          </h2>
          <p className="text-gray-600 mb-4">
            {isEditMode ? 'Your changes have been saved!' : 'Welcome to SkillShare!'} Redirecting to your profile...
          </p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isEditMode ? 'Edit Your Profile' : 'Create Your Profile'}
            </h1>
            <p className="text-gray-600">
              {isEditMode ? 'Update your information and skills!' : 'Tell us about yourself and connect with others!'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.displayName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.displayName && <p className="mt-1 text-sm text-red-600">{errors.displayName}</p>}
            </div>

            {/* University */}
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                University *
              </label>
              <input
                type="text"
                id="university"
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.university ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Stanford University"
              />
              {errors.university && <p className="mt-1 text-sm text-red-600">{errors.university}</p>}
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills * <span className="text-gray-500">(Select all that apply)</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-xl p-4">
                {skills.map(skill => (
                  <label key={skill.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.selectedSkills.includes(skill.name)}
                      onChange={() => handleSkillToggle(skill.name)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{skill.name}</span>
                  </label>
                ))}
              </div>
              {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills}</p>}
            </div>

            {/* Short Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Short Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
                placeholder="Tell us about yourself, your interests, and what you're passionate about..."
              />
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Social Links</h3>
              
              {/* Email */}
              <div>
                <label htmlFor="contactInfo.email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="contactInfo.email"
                  name="contactInfo.email"
                  value={formData.contactInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label htmlFor="contactInfo.social.linkedin" className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  id="contactInfo.social.linkedin"
                  name="contactInfo.social.linkedin"
                  value={formData.contactInfo.social.linkedin}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.linkedin ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
                {errors.linkedin && <p className="mt-1 text-sm text-red-600">{errors.linkedin}</p>}
              </div>

              {/* Instagram */}
              <div>
                <label htmlFor="contactInfo.social.instagram" className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  id="contactInfo.social.instagram"
                  name="contactInfo.social.instagram"
                  value={formData.contactInfo.social.instagram}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.instagram ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://instagram.com/yourusername"
                />
                {errors.instagram && <p className="mt-1 text-sm text-red-600">{errors.instagram}</p>}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability <span className="text-gray-500">(Check all that apply)</span>
              </label>
              <div className="space-y-2">
                {[
                  { value: 'projects', label: 'Open for projects' },
                  { value: 'tutoring', label: 'Available for tutoring' },
                  { value: 'both', label: 'Both projects and tutoring' }
                ].map(option => (
                  <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.availability.includes(option.value)}
                      onChange={() => handleAvailabilityToggle(option.value)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              {errors.submit && (
                <p className="mb-4 text-sm text-red-600 text-center">{errors.submit}</p>
              )}
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-300 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {saving ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isEditMode ? 'Updating Profile...' : 'Creating Profile...'}
                  </div>
                ) : (
                  isEditMode ? 'Update Profile' : 'Create Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
