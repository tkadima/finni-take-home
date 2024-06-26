import {
  AppBar,
  Box,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function AppNavBar() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  return (
    <AppBar position="static" style={{ backgroundColor: '#FFF' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <IconButton edge="start" color="inherit" aria-label="logo" href="/">
            <img src="/Logo.svg" alt="Logo" style={{ height: 40 }} />
          </IconButton>
        </Box>
        {isAuthenticated && router.pathname === '/' && (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
