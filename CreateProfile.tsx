import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { UserProfile } from './types';
import { createUserProfile, updateUserProfile } from './database-api';

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
    if (!user) return;
    
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
    
    // Set loading to false since we don't need to load anything from API
    setLoading(false);
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
      
      let errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} profile. Please try again.`;
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
          errorMessage = 'Authentication failed. Please log out and log back in.';
        } else if (error.message.includes('409') || error.message.includes('already exists')) {
          errorMessage = 'A profile already exists for this user. Try refreshing the page.';
        } else if (error.message.includes('400') || error.message.includes('validation')) {
          errorMessage = 'Invalid profile data. Please check all required fields.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again in a few moments.';
        }
      }
      
      setErrors({ submit: errorMessage });
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
      <div className="success-page">
        <div className="success-container">
          <div className="success-card">
            <div className="success-icon">
              <svg className="success-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="success-title">
              Profile {isEditMode ? 'Updated' : 'Created'} Successfully!
            </h2>
            <p className="success-message">
              {isEditMode ? 'Your changes have been saved!' : 'Welcome to SkillShare!'} Redirecting to your profile...
            </p>
            <div className="success-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-profile-container">
        <div className="create-profile-card">
          <div className="create-profile-header">
            <h1 className="create-profile-title">
              {isEditMode ? 'Edit Your Profile' : 'Create Your Profile'}
            </h1>
            <p className="create-profile-subtitle">
              {isEditMode ? 'Update your information and skills!' : 'Tell us about yourself and connect with others!'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="create-profile-form">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="displayName" className="form-label">
                <span className="form-label-text">Full Name</span>
                <span className="form-label-required">*</span>
              </label>
              <div className="form-input-wrapper">
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className={`form-input ${errors.displayName ? 'form-input--error' : formData.displayName ? 'form-input--valid' : ''}`}
                  placeholder="Enter your full name"
                />
                {formData.displayName && !errors.displayName && (
                  <div className="form-input-icon form-input-icon--success">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.displayName && <p className="form-error">{errors.displayName}</p>}
            </div>

            {/* University */}
            <div className="form-group">
              <label htmlFor="university" className="form-label">
                <span className="form-label-text">University</span>
                <span className="form-label-required">*</span>
              </label>
              <div className="form-input-wrapper">
                <input
                  type="text"
                  id="university"
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  className={`form-input ${errors.university ? 'form-input--error' : formData.university ? 'form-input--valid' : ''}`}
                  placeholder="e.g., Stanford University"
                />
                {formData.university && !errors.university && (
                  <div className="form-input-icon form-input-icon--success">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.university && <p className="form-error">{errors.university}</p>}
            </div>

            {/* Skills */}
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-text">Skills</span>
                <span className="form-label-required">*</span>
                <span className="form-label-note">(Select at least one)</span>
              </label>
              <div className="skills-grid">
                {[
                  "Design",
                  "Photography",
                  "Public Speaking",
                  "Marketing",
                  "Project Management",
                  "Coding",
                  "Writing",
                  "Video Editing",
                  "Data Analysis",
                  "UI/UX",
                ].map((skill) => (
                  <label key={skill} className={`skill-checkbox ${formData.selectedSkills.includes(skill) ? 'skill-checkbox--selected' : ''}`}>
                    <input
                      type="checkbox"
                      checked={formData.selectedSkills.includes(skill)}
                      onChange={() => handleSkillToggle(skill)}
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
              {errors.skills && <p className="form-error">{errors.skills}</p>}
              {formData.selectedSkills.length > 0 && !errors.skills && (
                <p className="form-success">Great! You've selected {formData.selectedSkills.length} skill{formData.selectedSkills.length !== 1 ? 's' : ''}.</p>
              )}
            </div>

            {/* Short Bio */}
            <div className="form-group">
              <label htmlFor="bio" className="form-label">
                <span className="form-label-text">Short Bio</span>
                <span className="bio-counter">
                  {formData.bio.length}/500 characters
                </span>
              </label>
              <div className="form-textarea-wrapper">
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  maxLength={500}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                />
              </div>
              {formData.bio.length > 0 && (
                <p className="form-hint">
                  {formData.bio.length < 50 ? 
                    'Consider adding more details to help others get to know you better!' :
                    'Great bio! This gives others a good sense of who you are.'
                  }
                </p>
              )}
            </div>

            {/* Social Links */}
            <div className="form-section">
              <h3 className="form-section-title">Social Links</h3>
              
              {/* Email */}
              <div className="form-group">
                <label htmlFor="contactInfo.email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="contactInfo.email"
                  name="contactInfo.email"
                  value={formData.contactInfo.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* LinkedIn */}
              <div className="form-group">
                <label htmlFor="contactInfo.social.linkedin" className="form-label">
                  LinkedIn
                </label>
                <input
                  type="url"
                  id="contactInfo.social.linkedin"
                  name="contactInfo.social.linkedin"
                  value={formData.contactInfo.social.linkedin}
                  onChange={handleInputChange}
                  className={`form-input ${errors.linkedin ? 'form-input--error' : ''}`}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
                {errors.linkedin && <p className="form-error">{errors.linkedin}</p>}
              </div>

              {/* Instagram */}
              <div className="form-group">
                <label htmlFor="contactInfo.social.instagram" className="form-label">
                  Instagram
                </label>
                <input
                  type="url"
                  id="contactInfo.social.instagram"
                  name="contactInfo.social.instagram"
                  value={formData.contactInfo.social.instagram}
                  onChange={handleInputChange}
                  className={`form-input ${errors.instagram ? 'form-input--error' : ''}`}
                  placeholder="https://instagram.com/yourusername"
                />
                {errors.instagram && <p className="form-error">{errors.instagram}</p>}
              </div>
            </div>

            {/* Availability */}
            <div className="form-group">
              <label className="form-label">
                Availability <span className="form-label-note">(Check all that apply)</span>
              </label>
              <div className="availability-options">
                {[
                  { value: 'projects', label: 'Open for projects' },
                  { value: 'tutoring', label: 'Available for tutoring' },
                  { value: 'both', label: 'Both projects and tutoring' }
                ].map(option => (
                  <label key={option.value} className="availability-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.availability.includes(option.value)}
                      onChange={() => handleAvailabilityToggle(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-submit">
              {errors.submit && (
                <p className="form-error form-error--center">{errors.submit}</p>
              )}
              <button
                type="submit"
                disabled={saving}
                className="btn btn--primary btn--large"
              >
                {saving ? (
                  <>
                    <span className="btn-spinner"></span>
                    {isEditMode ? 'Updating Profile...' : 'Creating Profile...'}
                  </>
                ) : (
                  isEditMode ? 'Update Profile' : 'Create Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default CreateProfile;
