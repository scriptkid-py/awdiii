import React, { useState, useEffect } from 'react';
import { UserProfile, SearchFilters } from './types';
import { searchProfiles } from './database-api';
import { getProfilePictureUrl } from './utils';
import { useAuth } from './AuthContext';

interface SkillBrowserProps {
  onProfileClick: (profile: UserProfile) => void;
}

const SkillBrowser: React.FC<SkillBrowserProps> = ({ onProfileClick }) => {
  const { user } = useAuth(); // Get current Firebase user
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    skills: [],
    categories: [],
    availability: []
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const profilesData = await searchProfiles(filters);
        
        // Sort profiles so the logged-in user's profile appears first
        if (user) {
          const sortedProfiles = profilesData.sort((a, b) => {
            if (a.uid === user.uid) return -1; // User's profile first
            if (b.uid === user.uid) return 1;  // User's profile first
            return 0; // Keep original order for others
          });
          setProfiles(sortedProfiles);
        } else {
          setProfiles(profilesData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters, user]);

  const handleFilterChange = (filterType: keyof SearchFilters, value: string) => {
    setFilters(prev => {
      const currentArray = prev[filterType] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [filterType]: newArray
      };
    });
  };


  const clearFilters = () => {
    setFilters({
      skills: [],
      categories: [],
      availability: []
    });
  };

  if (loading) {
    return (
      <div className="skill-browser">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Loading profiles...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="skill-browser">
      <div className="browse-layout">
        {/* Left Sidebar */}
        <aside className="browse-sidebar">

          <div className="filter-section">
            <h3 className="sidebar-title">Filter by Skill</h3>
            <div className="filter-options">
              {['Design', 'Coding', 'Photography', 'Writing', 'Public Speaking', 'Video Editing'].map(skill => (
                <label key={skill} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.skills.includes(skill)}
                    onChange={() => handleFilterChange('skills', skill)}
                  />
                  <span className="checkmark"></span>
                  {skill}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3 className="sidebar-title">Availability</h3>
            <div className="filter-options">
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.availability.includes('projects')}
                  onChange={() => handleFilterChange('availability', 'projects')}
                />
                <span className="checkmark"></span>
                Open for projects
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.availability.includes('tutoring')}
                  onChange={() => handleFilterChange('availability', 'tutoring')}
                />
                <span className="checkmark"></span>
                Available for tutoring
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="browse-main">
          {profiles.length === 0 ? (
            <div className="no-results">
              <p>No profiles found matching your criteria.</p>
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="profiles-grid">
              {profiles.map(profile => (
                <div 
                  key={profile.id} 
                  className="profile-card"
                  onClick={() => onProfileClick(profile)}
                >
                  <div className="profile-avatar">
                    <img 
                      src={getProfilePictureUrl(
                        // Use Firebase user's photo if this is the current user's profile
                        profile.uid === user?.uid ? (user.photoURL || undefined) : profile.photoURL, 
                        profile.email, 
                        120
                      )} 
                      alt={profile.displayName}
                      className="avatar-image"
                    />
                  </div>
                  <h3 className="profile-name">{profile.displayName}</h3>
                  <p className="profile-field">{profile.university || 'University'}</p>
                  <div className="profile-skills">
                    {profile.skills.slice(0, 4).map(skill => (
                      <span key={skill} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SkillBrowser;
