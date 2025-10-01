import React from 'react';
import { UserProfile } from './types';

interface ProfileViewProps {
  profile: UserProfile;
  onBack: () => void;
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  profile, 
  onBack, 
  isOwnProfile = false, 
  onEdit 
}) => {
  return (
    <div className="profile-view">
      <div className="profile-page">
        <div className="profile-page__header">
          <img 
            src={profile.photoURL || '/default-avatar.png'} 
            alt={profile.displayName}
            className="profile-page__image"
          />
          <div className="profile-page__info">
            <h1 className="profile-page__name">{profile.displayName}</h1>
            {profile.major && (
              <p className="profile-page__major">{profile.major}</p>
            )}
            {profile.university && (
              <p className="profile-page__university">{profile.university}</p>
            )}
            {profile.year && (
              <p className="profile-page__year">{profile.year}</p>
            )}
            <div className={`profile-page__availability profile-page__availability--${profile.availability}`}>
              {profile.availability}
            </div>
          </div>
          {isOwnProfile && onEdit && (
            <button onClick={onEdit} className="button">
              Edit Profile
            </button>
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
            {profile.skills.map(skill => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>

        {profile.interests.length > 0 && (
          <div className="profile-page__section">
            <h2>Interests</h2>
            <div className="profile-page__skills">
              {profile.interests.map(interest => (
                <span key={interest} className="skill-tag">{interest}</span>
              ))}
            </div>
          </div>
        )}

        <div className="profile-page__section">
          <h2>Contact</h2>
          <div className="profile-page__contact">
            <a href={`mailto:${profile.email}`} className="contact-link">
              📧 {profile.email}
            </a>
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={onBack} className="button button--secondary">
            Back to Browse
          </button>
          {!isOwnProfile && (
            <button className="button">
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
