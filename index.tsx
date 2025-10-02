import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
  // No longer need MongoDB context - using backend API
import Login from './Login';
import ProfileManager from './ProfileManager';
import CreateProfile from './CreateProfile';
import SkillBrowser from './SkillBrowser';
import ProfileView from './ProfileView';
import { UserProfile } from './types';
import { getUserProfile, initializeDefaultData, connectToDatabase } from './database-api';

// Main App component with routing
const App: React.FC = () => {
  const { user, loading } = useAuth();
  // No longer need MongoDB context - using backend API
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [showCreateProfile, setShowCreateProfile] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
          setShowCreateProfile(!profile);
          setShowProfileManager(false);
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setUserProfile(null);
        setSelectedProfile(null);
        setShowProfileManager(false);
        setShowCreateProfile(false);
      }
    };

    loadUserProfile();
  }, [user]);

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowProfileManager(false);
    setShowCreateProfile(false);
  };

  const handleProfileClick = (profile: UserProfile) => {
    setSelectedProfile(profile);
  };

  const handleBackToBrowse = () => {
    setSelectedProfile(null);
  };

  const handleEditProfile = () => {
    setShowProfileManager(true);
    setShowCreateProfile(false);
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
        {!user ? (
          <div className="login-page">
            <h2>Welcome to SkillShare</h2>
            <p>Connect with people who share your skills and interests</p>
            <Login />
          </div>
        ) : showCreateProfile ? (
          <CreateProfile onProfileComplete={handleProfileComplete} />
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

// Initialize backend API connection at startup
const initializeApp = async () => {
  console.log('🚀 Initializing SkillShare application...');
  
  try {
    // Test backend API connection
    await connectToDatabase();
    console.log('✅ Backend API connection established');
    
    // Initialize default data (skills and categories)
    await initializeDefaultData();
    console.log('✅ Default data initialized');
    
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    // Continue with app startup even if backend API fails
  }
  
  console.log('🎉 Application initialization complete');
};

// Wrapper component that handles initialization
const AppWithInitialization: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initStatus, setInitStatus] = useState('Connecting to backend API...');

  useEffect(() => {
    const initialize = async () => {
      setInitStatus('Connecting to backend API...');
      await initializeApp();
      setInitStatus('Ready!');
      setIsInitialized(true);
    };

    initialize();
  }, []);

  if (!isInitialized) {
    return (
      <div className="app-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Initializing SkillShare...</h2>
          <p>Status: {initStatus}</p>
        </div>
      </div>
    );
  }

  return <App />;
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
        <AppWithInitialization />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
