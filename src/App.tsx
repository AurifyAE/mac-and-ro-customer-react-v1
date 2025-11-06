
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

// Component to handle redirects for authenticated users
const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already authenticated, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, show the login/register page
  return <>{children}</>;
};

function App() {
  // Global effect to disable autocomplete on all forms
  useEffect(() => {
    const disableAutocomplete = () => {
      const forms = document.querySelectorAll('form');
      const inputs = document.querySelectorAll('input, textarea, select');
      
      forms.forEach(form => {
        form.setAttribute('autocomplete', 'off');
      });
      
      inputs.forEach(input => {
        input.setAttribute('autocomplete', 'off');
      });
    };

    // Run on mount
    disableAutocomplete();
    
    // Run whenever new elements are added to DOM
    const observer = new MutationObserver(disableAutocomplete);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => observer.disconnect();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Protected route - requires authentication */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            
            {/* Public routes - redirect to home if already authenticated */}
            <Route 
              path="/login" 
              element={
                <AuthRedirect>
                  <Login />
                </AuthRedirect>
              } 
            />
            
            <Route 
              path="/register" 
              element={
                <AuthRedirect>
                  <Register />
                </AuthRedirect>
              } 
            />
            
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
