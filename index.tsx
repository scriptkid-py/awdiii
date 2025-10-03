import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
  // No longer need MongoDB context - using backend API
import Login from './Login';
import CreateProfile from './CreateProfile';
import SkillBrowser from './SkillBrowser';
import ProfileView from './ProfileView';
import AboutUs from './AboutUs';
import { UserProfile } from './types';
import { getUserProfile, getProfileById, initializeDefaultData, connectToDatabase } from './database-api';
import { getProfilePictureUrl } from './utils';

// Navigation component
const Navigation: React.FC<{ userProfile: UserProfile | null }> = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddProfile = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/add-profile');
  };


  return (
    <header className="header">
      <div className="header__logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        SkillShare
      </div>
      <nav className="header__nav">
        {user && (
          <>
            <button onClick={() => navigate('/')} className="nav-link">
              Browse
            </button>
            <button onClick={() => navigate('/about')} className="nav-link">
              About
            </button>
            <button 
              onClick={handleAddProfile}
              className="nav-link"
            >
              Add Your Profile
            </button>
          </>
        )}
        <Login />
      </nav>
    </header>
  );
};

// Login page component
const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <h2>Welcome to SkillShare</h2>
      <p>Connect with people who share your skills and interests</p>
      <Login />
    </div>
  );
};

// Browse page component
const BrowsePage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleProfileClick = (profile: UserProfile) => {
    navigate(`/profile/${profile.id}`);
  };

  return <SkillBrowser onProfileClick={handleProfileClick} />;
};

// Profile view page component
const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileId = location.pathname.split('/').pop();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!profileId) {
        console.log('No profile ID found');
        setLoading(false);
        return;
      }
      console.log('Loading profile with ID:', profileId);
      try {
        const profileData = await getProfileById(profileId);
        console.log('Profile data loaded:', profileData);
        setProfile(profileData);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [profileId]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading profile...</div>;
  }

  if (!profile) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Profile not found</div>;
  }

  console.log('Rendering profile:', profile);

  const handleProfileDelete = () => {
    // Navigate back to home and refresh the page to clear any cached data
    navigate('/');
    window.location.reload();
  };

  return (
    <ProfileView 
      profile={profile}
      onBack={() => navigate('/')}
      isOwnProfile={profile.uid === user?.uid}
      onEdit={profile.uid === user?.uid ? () => navigate('/add-profile') : undefined}
      onDelete={profile.uid === user?.uid ? handleProfileDelete : undefined}
    />
  );
};

// Add Profile page component
const AddProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      try {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [user, navigate]);

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    navigate('/'); // Redirect to browse page
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  return (
    <CreateProfile 
      onProfileComplete={handleProfileComplete} 
      existingProfile={userProfile}
      isEditMode={!!userProfile}
    />
  );
};

// Main App component with routing
const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
    };

    loadUserProfile();
  }, [user]);

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
      <Navigation userProfile={userProfile} />
      <main>
        <Routes>
          <Route path="/" element={user ? <BrowsePage /> : <LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/add-profile" element={<AddProfilePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
