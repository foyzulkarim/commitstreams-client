import { Helmet } from 'react-helmet-async';
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from 'src/contexts/AuthContext';

import { RegisterView } from 'src/sections/register';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <Helmet>
        <title> Register | CommitStreams </title>
      </Helmet>

      <RegisterView />
    </>
  );
}
