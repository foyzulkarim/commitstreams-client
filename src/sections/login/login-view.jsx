import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

// import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginView() {

  const router = useRouter();

  const theme = useTheme();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleGitHubLogin = () => {
    window.location.href = `${apiUrl}/auth/github`; // Adjust for your backend port
  };

  const handlePasswordLogin = () => {
    router.push('/login-password');
  }


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
          <Stack spacing={2}>
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
              onClick={handlePasswordLogin}

            >
              <Iconify icon="ant-design:lock-filled" color="black" />
              &nbsp; Login with Password
            </Button>
            <Button
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
              onClick={() => router.push('/register')}
            >
              <Iconify icon="ant-design:user-add-outlined" color="black" />
              &nbsp; Register
            </Button>
          </Stack>
        </Card>
      </Stack >
    </Box >
  );
}
