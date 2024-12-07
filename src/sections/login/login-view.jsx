import { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';
import { AuthContext } from 'src/contexts/AuthContext';

import Iconify from 'src/components/iconify';

export default function LoginView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { setAuthState } = useContext(AuthContext);

  const handleGitHubLogin = () => {
    window.location.href = `${apiUrl}/auth/github`;
  };

  const handleGoogleLogin = () => {
    window.location.href = `${apiUrl}/auth/google`;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        setAuthState(data.user);
        navigate('/'); // Redirect to dashboard or home page
      } else {
        // Login failed
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Stack spacing={3}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={handleEmailLogin}
            >
              Login with Email
            </Button>
            <Typography variant="body2" align="center">
              Don&apos;t have an account?{' '}
              <Link component={RouterLink} to="/register" variant="subtitle2">
                Register
              </Link>
            </Typography>
            <Button
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
              onClick={handleGitHubLogin}
            >
              <Iconify icon="ant-design:github-filled" color="black" />
              &nbsp; Login with GitHub
            </Button>
            <Button
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
              onClick={handleGoogleLogin}
            >
              <Iconify icon="flat-color-icons:google" />
              &nbsp; Login with Google
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
