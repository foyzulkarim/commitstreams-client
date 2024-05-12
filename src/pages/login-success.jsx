import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAlert } from 'src/contexts/AlertContext';

const LoginSuccess = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    showAlert('Login successful', 'success');
    navigate('/', { replace: true });
  }, [navigate, showAlert]);

  return (
    <div>Loading...</div> // Or a loading indicator
  );
};

export default LoginSuccess;
