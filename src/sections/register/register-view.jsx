import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function RegisterView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = useCallback(() => {
    router.push('/');
  }, [router]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1.5}>
      <TextField
        fullWidth
        name="username"
        label="Username"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="email"
        label="Email address"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleRegister}
      >
        Register
      </LoadingButton>
    </Box>
  );

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
      <Card sx={{
        p: 5,
        width: 1,
        maxWidth: 420,
      }}>
        <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
          <Typography variant="h5">Register</Typography>
          <Typography variant="body2" color="text.secondary">
            Already have an account?
            <Typography
              component="a"
              variant="subtitle2"
              sx={{ ml: 0.5, cursor: 'pointer' }}
              onClick={() => router.push('/login')}
            >
              Sign in
            </Typography>
          </Typography>
        </Box>

        {renderForm}
      </Card>
    </Stack>
  );
}
