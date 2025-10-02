import React, { useState, useEffect } from 'react';
import { UserProfile, Skill, SkillCategory, SearchFilters } from './types';
import { searchProfiles, getAllSkills, getSkillCategories } from './database-api';

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
      <div className="browse-page">
        <div className="browse-page__filters">
          <h2>Find People</h2>
          
          <div className="browse-page__filter-group">
            <h3>Search</h3>
            <input
              type="text"
              placeholder="Search by name, skills, or bio..."
              value={filters.searchTerm || ''}
              onChange={handleSearchChange}
            />
          </div>

          <div className="browse-page__filter-group">
            <h3>Skills</h3>
            {skills.map(skill => (
              <label key={skill.id}>
                <input
                  type="checkbox"
                  checked={filters.skills.includes(skill.name)}
                  onChange={() => handleFilterChange('skills', skill.name)}
                />
                {skill.name}
              </label>
            ))}
          </div>

          <div className="browse-page__filter-group">
            <h3>Categories</h3>
            {categories.map(category => (
              <label key={category.id}>
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category.name)}
                  onChange={() => handleFilterChange('categories', category.name)}
                />
                {category.name}
              </label>
            ))}
          </div>

          <div className="browse-page__filter-group">
            <h3>Availability</h3>
            <label>
              <input
                type="checkbox"
                checked={filters.availability.includes('available')}
                onChange={() => handleFilterChange('availability', 'available')}
              />
              Available
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.availability.includes('busy')}
                onChange={() => handleFilterChange('availability', 'busy')}
              />
              Busy
            </label>
          </div>

          <button onClick={clearFilters} className="button button--secondary">
            Clear Filters
          </button>
        </div>

        <div className="browse-page__results">
          <h2>People ({profiles.length})</h2>
          
          {profiles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No profiles found matching your criteria.</p>
              <button onClick={clearFilters} className="button">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="browse-page__results-grid">
              {profiles.map(profile => (
                <div 
                  key={profile.id} 
                  className="profile-card"
                  onClick={() => onProfileClick(profile)}
                >
                  <img 
                    src={profile.photoURL || '/default-avatar.png'} 
                    alt={profile.displayName}
                    className="profile-card__image"
                  />
                  <h3 className="profile-card__name">{profile.displayName}</h3>
                  {profile.major && (
                    <p className="profile-card__major">{profile.major}</p>
                  )}
                  {profile.university && (
                    <p className="profile-card__university">{profile.university}</p>
                  )}
                  {profile.bio && (
                    <p className="profile-card__bio">{profile.bio.substring(0, 100)}...</p>
                  )}
                  <div className="profile-card__skills">
                    {profile.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                    {profile.skills.length > 3 && (
                      <span className="skill-tag">+{profile.skills.length - 3} more</span>
                    )}
                  </div>
                  <div className={`profile-card__availability profile-card__availability--${profile.availability}`}>
                    {profile.availability}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillBrowser;
