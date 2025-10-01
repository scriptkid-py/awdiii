import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onUnauthorized: () => void;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, onUnauthorized }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    // When loading is finished and there's no user, trigger the redirect.
    if (!loading && !user) {
      onUnauthorized();
    }
  }, [user, loading, onUnauthorized]);

  // While checking auth state, show a loading indicator.
  if (loading) {
    return <div style={{textAlign: 'center', padding: '2rem'}}>Loading...</div>;
  }

  // If there's a user, render the protected content.
  // If there's no user, render null because the redirect is being handled.
  return user ? <>{children}</> : null;
};

export default ProtectedRoute;