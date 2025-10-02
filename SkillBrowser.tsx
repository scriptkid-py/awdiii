import React, { useState, useEffect } from 'react';
import { UserProfile, Skill, SkillCategory, SearchFilters } from './types';
import { searchProfiles, getAllSkills, getSkillCategories } from './database-api';
import { getProfilePictureUrl } from './utils';

interface SkillBrowserProps {
  onProfileClick: (profile: UserProfile) => void;
}

const SkillBrowser: React.FC<SkillBrowserProps> = ({ onProfileClick }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    skills: [],
    categories: [],
    availability: [],
    searchTerm: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [skillsData, categoriesData, profilesData] = await Promise.all([
          getAllSkills(),
          getSkillCategories(),
          searchProfiles(filters)
        ]);
        setSkills(skillsData);
        setCategories(categoriesData);
        setProfiles(profilesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters]);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: e.target.value
    }));
  };

  const clearFilters = () => {
    setFilters({
      skills: [],
      categories: [],
      availability: [],
      searchTerm: ''
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
          <div className="search-section">
            <h3 className="sidebar-title">Search</h3>
            <input
              type="text"
              placeholder="Search by name..."
              value={filters.searchTerm || ''}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

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
                      src={getProfilePictureUrl(profile.photoURL, profile.email, 120)} 
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
