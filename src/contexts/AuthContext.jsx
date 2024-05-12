import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, createContext } from 'react';

import { useAlert } from './AlertContext';

const AuthContext = createContext({
  isAuthenticated: false,
  userProfile: null,
  setAuthState: () => { },
});
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${apiUrl}/user`, {
          credentials: 'include'  // Crucial setting 
        });

        if (!response.ok) {
          throw new Error('Profile fetch failed');
        } else {
          const data = await response.json();
          setAuthState(data);
        }
      } catch (error) {
        clearAuthState();
        navigate('/login');
      }
    };

    const url = new URL(window.location.href);
    if (url.pathname === '/login') {
      const error = url.searchParams.get('error');
      if (error) {
        if (error === 'user-is-deactivated') {
          showAlert(`Login failed. User is deactivated.`, 'error');
        }
        else { showAlert(`Login failed.`, 'error'); }
      }
      return;
    }

    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const setAuthState = (authData) => {
    setIsAuthenticated(true);
    setUserProfile(authData);
  };

  const clearAuthState = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  const logout = async () => {
    window.location.href = `${apiUrl}/logout`;
  }

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{ isAuthenticated, userProfile, setAuthState, clearAuthState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
