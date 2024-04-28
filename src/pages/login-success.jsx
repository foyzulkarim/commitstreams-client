import { useNavigate } from 'react-router-dom';
import React, { useEffect, useContext } from 'react';

import { AuthContext } from 'src/contexts/AuthContext';

const LoginSuccess = () => {
  const navigate = useNavigate();
  const { setAuthState } = useContext(AuthContext);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${apiUrl}/user`, {
          credentials: 'include'  // Crucial setting 
        });

        if (!response.ok) {
          throw new Error('Profile fetch failed');
        }

        const data = await response.json();
        setAuthState(data);
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Handle the error (redirect to login, show error message)
      }
    };
    console.log('fetchUserProfile:');
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>Loading...</div> // Or a loading indicator
  );
};

export default LoginSuccess;
