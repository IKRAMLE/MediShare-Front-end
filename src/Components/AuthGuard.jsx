import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true
  });
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    setAuthState({
      isAuthenticated: !!(token && userData),
      isLoading: false
    });
  }, []);
  
  if (authState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-500"></div>
      </div>
    );
  }
  
  // Instead of programmatic navigation, use Navigate component
  // This ensures the route never renders at all if not authenticated
  if (!authState.isAuthenticated) {
    return <Navigate to="/login2" replace />;
  }
  
  return children;
};

export default AuthGuard;