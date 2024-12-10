import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { bgGradient } from 'src/theme/css';
import { useAlert } from 'src/contexts/AlertContext';

export default function VerifyEmailView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [searchParams] = useSearchParams();
  const [verificationFailed, setVerificationFailed] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        showAlert('Invalid verification link', 'error');
        setVerificationFailed(true);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/verify-email?token=${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          showAlert('Email verified successfully', 'success');
          navigate('/login');
        } else {
          showAlert(data.message || 'Email verification failed', 'error');
          setVerificationFailed(true);
        }
      } catch (err) {
        showAlert('An error occurred during verification', 'error');
        setVerificationFailed(true);
      }
    };

    verifyEmail();
  }, [apiUrl, navigate, showAlert, searchParams]);

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
          <Stack spacing={3} alignItems="center">
            {!verificationFailed ? (
              <>
                <CircularProgress />
                <Typography variant="h6">
                  Verifying your email...
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" color="error">
                  Verification Failed
                </Typography>
                <Typography variant="body2" align="center">
                  The verification link may have expired. Need a new verification link?{' '}
                  <Link component={RouterLink} to="/resend-verification" variant="subtitle2">
                    Click here
                  </Link>
                </Typography>
              </>
            )}
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
} 
