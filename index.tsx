import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import ProfileManager from './ProfileManager';
import SkillBrowser from './SkillBrowser';
import ProfileView from './ProfileView';
import MongoDBTest from './MongoDBTest';
import { UserProfile } from './types';
import { getUserProfile } from './database-mongodb';

// Main App component with routing
const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [showProfileManager, setShowProfileManager] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
          setShowProfileManager(!profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setUserProfile(null);
        setSelectedProfile(null);
        setShowProfileManager(false);
      }
    };

    loadUserProfile();
  }, [user]);

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowProfileManager(false);
  };

  const handleProfileClick = (profile: UserProfile) => {
    setSelectedProfile(profile);
  };

  const handleBackToBrowse = () => {
    setSelectedProfile(null);
  };

  const handleEditProfile = () => {
    setShowProfileManager(true);
  };

  if (loading) {
    return (
      <div className="app-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header__logo">SkillShare</div>
        <nav className="header__nav">
          {user && userProfile && (
            <>
              <button onClick={() => setSelectedProfile(null)}>
                Browse
              </button>
              <button onClick={handleEditProfile}>
                My Profile
              </button>
            </>
          )}
          <Login />
        </nav>
      </header>

      <main>
        <MongoDBTest />
        {!user ? (
          <div className="login-page">
            <h2>Welcome to SkillShare</h2>
            <p>Connect with people who share your skills and interests</p>
            <Login />
          </div>
        ) : showProfileManager ? (
          <ProfileManager onProfileComplete={handleProfileComplete} />
        ) : selectedProfile ? (
          <ProfileView 
            profile={selectedProfile}
            onBack={handleBackToBrowse}
            isOwnProfile={selectedProfile.uid === user.uid}
            onEdit={selectedProfile.uid === user.uid ? handleEditProfile : undefined}
          />
        ) : (
          <SkillBrowser onProfileClick={handleProfileClick} />
        )}
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
