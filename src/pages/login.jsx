/* eslint-disable import/no-unresolved */
import { Helmet } from 'react-helmet-async';
import { useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';

import { useRouter } from 'src/routes/hooks';

import { AuthContext } from 'src/contexts/AuthContext';

import { LoginView } from 'src/sections/login';

// ----------------------------------------------------------------------

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useContext(AuthContext);
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    };
  });

  return (
    <>
      <Helmet>
        <title> Login | CommitStreams </title>
      </Helmet>

      <LoginView />
    </>
  );
}
