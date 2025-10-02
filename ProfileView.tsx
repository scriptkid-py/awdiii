import React, { useState } from 'react';
import { UserProfile } from './types';
import { deleteUserProfile } from './database-api';
import { getProfilePictureUrl } from './utils';
import { useAuth } from './AuthContext';

interface ProfileViewProps {
  profile: UserProfile;
  onBack: () => void;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  profile, 
  onBack, 
  isOwnProfile = false, 
  onEdit,
  onDelete
}) => {
  const { user } = useAuth(); // Get current Firebase user
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Add safety check for profile data
  if (!profile) {
    return (
      <div className="profile-view">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Profile data is not available</p>
          <button onClick={onBack} className="button button--secondary">
            Back to Browse
          </button>
        </div>
      </div>
    );
  }


  const handleDeleteProfile = async () => {
    if (!isOwnProfile || !profile.id) return;
    
    try {
      setIsDeleting(true);
      await deleteUserProfile(profile.id);
      setShowDeleteConfirm(false);
      if (onDelete) {
        onDelete();
      } else {
        onBack();
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Failed to delete profile. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div className="profile-view">
      <div className="profile-page">
        <div className="profile-page__header">
          <img 
            src={getProfilePictureUrl(
              // Use Firebase user's photo if this is the current user's profile
              profile.uid === user?.uid ? user.photoURL : profile.photoURL, 
              profile.email, 
              200
            )} 
            alt={profile.displayName || 'User'}
            className="profile-page__image"
          />
          <div className="profile-page__info">
            <h1 className="profile-page__name">{profile.displayName || 'Unknown User'}</h1>
            {profile.major && (
              <p className="profile-page__major">{profile.major}</p>
            )}
            {profile.university && (
              <p className="profile-page__university">{profile.university}</p>
            )}
            {profile.year && (
              <p className="profile-page__year">{profile.year}</p>
            )}
            <div className={`profile-page__availability profile-page__availability--${Array.isArray(profile.availability) ? profile.availability[0] : profile.availability}`}>
              {Array.isArray(profile.availability) ? profile.availability.join(', ') : profile.availability}
            </div>
          </div>
          {isOwnProfile && (
            <div className="profile-actions-header">
              {onEdit && (
                <button onClick={onEdit} className="button">
                  Edit Profile
                </button>
              )}
              <button 
                onClick={() => setShowDeleteConfirm(true)} 
                className="button button--danger"
                style={{ marginLeft: '0.5rem' }}
              >
                Delete Profile
              </button>
            </div>
          )}
        </div>

        {profile.bio && (
          <div className="profile-page__section">
            <h2>About</h2>
            <p>{profile.bio}</p>
          </div>
        )}

        <div className="profile-page__section">
          <h2>Skills</h2>
          <div className="profile-page__skills">
            {console.log('Profile skills being displayed:', profile.skills)}
            {(profile.skills || []).map(skill => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>

        {profile.interests && profile.interests.length > 0 && (
          <div className="profile-page__section">
            <h2>Interests</h2>
            <div className="profile-page__skills">
              {(profile.interests || []).map(interest => (
                <span key={interest} className="skill-tag">{interest}</span>
              ))}
            </div>
          </div>
        )}

        <div className="profile-page__section">
          <h2>Contact & Social Media</h2>
          <div className="profile-page__contact">
            <a href={`mailto:${profile.email || 'user@example.com'}`} className="contact-link">
              📧 {profile.email || 'No email provided'}
            </a>
            
            {/* Social Media Links */}
            {profile.contactInfo?.social?.linkedin && (
              <a href={profile.contactInfo.social.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
                💼 LinkedIn Profile
              </a>
            )}
            
            {profile.contactInfo?.social?.github && (
              <a href={profile.contactInfo.social.github} target="_blank" rel="noopener noreferrer" className="contact-link">
                💻 GitHub Profile
              </a>
            )}
            
            {profile.contactInfo?.social?.instagram && (
              <a href={profile.contactInfo.social.instagram} target="_blank" rel="noopener noreferrer" className="contact-link">
                📸 Instagram Profile
              </a>
            )}
            
            {profile.contactInfo?.social?.twitter && (
              <a href={profile.contactInfo.social.twitter} target="_blank" rel="noopener noreferrer" className="contact-link">
                🐦 Twitter Profile
              </a>
            )}

          {profile.contactInfo?.social?.whatsapp && (
            <a
              href={profile.contactInfo.social.whatsapp.startsWith('http') || profile.contactInfo.social.whatsapp.startsWith('wa:')
                ? profile.contactInfo.social.whatsapp
                : `https://wa.me/${profile.contactInfo.social.whatsapp.replace(/[^\d+]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              💬 WhatsApp
            </a>
          )}
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={onBack} className="button button--secondary">
            Back to Browse
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Delete Profile</h3>
              <p>Are you sure you want to delete your profile? This action cannot be undone.</p>
              <div className="modal-actions">
                <button 
                  onClick={() => setShowDeleteConfirm(false)} 
                  className="button button--secondary"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteProfile} 
                  className="button button--danger"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Profile'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
