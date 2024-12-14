import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';
import { useAlert } from 'src/contexts/AlertContext';

export default function ResendVerificationView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const validateEmail = (value) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(value);
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      showAlert('Please enter a valid email address', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('Verification email sent successfully. Please check your inbox. Alternatively, you can send an email to foyzulkarim@gmail.com to get your account verified.', 'success');
        navigate('/login');
      } else {
        showAlert(data.message || 'Failed to send verification email', 'error');
      }
    } catch (err) {
      showAlert('An error occurred. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
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
            <Typography variant="h4" align="center">
              Resend Verification Email
            </Typography>

            <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
              Enter your email address and we&apos;ll send you a new verification link.
            </Typography>

            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />

            <Button
              size="large"
              variant="contained"
              onClick={handleResendVerification}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Resend Verification Email'}
            </Button>

            <Button
              size="small"
              variant="text"
              onClick={() => navigate('/login')}
              sx={{ mt: 1 }}
            >
              Back to Login
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
} 
