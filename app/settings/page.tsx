'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { goto404 } from '../utils/error';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Paper,
  useTheme as useMuiTheme,
} from '@mui/material';
import { useTheme } from 'next-themes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const SettingsPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme } = useTheme();
  const muiTheme = useMuiTheme();
  const isDark = theme === 'dark';
  const [mounted, setMounted] = useState(false);

  // State for delete account dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle mounting state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check authentication status
  useEffect(() => {
    if (status === 'unauthenticated') {
      goto404('405', 'User not found', router);
    }
  }, [status, router]);

  if (!mounted) {
    return null; // Return null on server-side and first render
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const handleDeleteAccount = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEmailInput('');
    setError(null);
  };

  const handleEmailVerification = async () => {
    if (!session) {
      goto404('405', 'User not found', router);
      return;
    }
    const user = session.user;
    if (user) {
      console.log('session:', user.email);
    }
    // if (emailInput === session?.user?.email) {
    //   setLoading(true);
    //   setError(null);
    //   try {
    //     const res = await fetch('/api/auth/delete', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ email: emailInput }),
    //       credentials: 'include', // Important: include credentials to handle cookies
    //     });
        
    //     const data = await res.json();
        
    //     if (!res.ok) {
    //       setError(data?.error || 'Failed to delete account.');
    //       setLoading(false);
    //       return;
    //     }

    //     // Clear any stored data in localStorage/sessionStorage
    //     localStorage.removeItem('next-auth.session-token');
    //     sessionStorage.removeItem('next-auth.session-token');

    //     // Close the dialog
    //     setOpenDialog(false);

    //     // Show success message briefly before redirect
    //     setError(null);
    //     setLoading(false);
        
    //     // Force a hard reload to clear any remaining state
    //     window.location.href = '/';
    //   } catch (err) {
    //     console.error('Delete account error:', err);
    //     setError('An unexpected error occurred.');
    //     setLoading(false);
    //   }
    // } else {
    //   setError('Email does not match your account email');
    // }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput }),
        credentials: 'include', // Important: include credentials to handle cookies
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data?.error || 'Failed to delete account.');
        setLoading(false);
        return;
      }

      // Clear any stored data in localStorage/sessionStorage
      localStorage.removeItem('next-auth.session-token');
      sessionStorage.removeItem('next-auth.session-token');

      // Close the dialog
      setOpenDialog(false);

      // Show success message briefly before redirect
      setError(null);
      setLoading(false);
      
      // Force a hard reload to clear any remaining state
      window.location.href = '/';
    } catch (err) {
      console.error('Delete account error:', err);
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handleLogout = async () => {
    try {
      // Clear session_id cookie
      document.cookie = 'session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Sign out from NextAuth
      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 dark:bg-green-900">
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToDashboard}
          variant="text"
          sx={{
            color: !isDark ? '#fff' : '#0A2F1F',
            fontWeight: 500,
            fontSize: '1rem',
            textTransform: 'none',
            mb: 4,
            pl: 0,
            '&:hover': {
              backgroundColor: !isDark ? 'rgba(255,255,255,0.08)' : 'rgba(10,47,31,0.08)',
            },
          }}
        >
          Back to Dashboard
        </Button>

        <Paper 
          elevation={0}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 3,
            bgcolor: isDark ? 'grey.900' : '#fff',
            border: `1px solid ${isDark ? muiTheme.palette.grey[800] : muiTheme.palette.grey[200]}`,
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ mb: 4, fontWeight: 700, color: isDark ? '#fff' : '#0A2F1F' }}
          >
            Account Settings
          </Typography>

          {/* Session User Information */}
          <Box
            sx={{
              p: { xs: 2, sm: 4 },
              borderRadius: 2,
              bgcolor: isDark ? muiTheme.palette.grey[800] : muiTheme.palette.grey[100],
              border: `1px solid ${isDark ? muiTheme.palette.grey[700] : muiTheme.palette.grey[300]}`,
              mb: 4
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ color: isDark ? '#fff' : '#0A2F1F', mb: 2 }}
            >
              Session Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {session?.user && Object.entries(session.user).map(([key, value]) => (
                <Box key={key} sx={{ display: 'flex', gap: 2 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: isDark ? muiTheme.palette.grey[400] : muiTheme.palette.grey[700],
                      fontWeight: 600,
                      minWidth: '120px'
                    }}
                  >
                    {key}:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ color: isDark ? '#fff' : '#0A2F1F' }}
                  >
                    {String(value)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" gap={4}>
            {/* Logout Section */}
            <Box
              sx={{
                p: { xs: 2, sm: 4 },
                borderRadius: 2,
                bgcolor: isDark ? muiTheme.palette.grey[800] : muiTheme.palette.grey[100],
                border: `1px solid ${isDark ? muiTheme.palette.grey[700] : muiTheme.palette.grey[300]}`,
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ color: isDark ? '#fff' : '#0A2F1F', mb: 2 }}
              >
                Session Management
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ color: isDark ? muiTheme.palette.grey[400] : muiTheme.palette.grey[700], mb: 3 }}
              >
                Sign out of your account on this device.
              </Typography>
              <Button
                variant="contained"
                onClick={handleLogout}
                sx={{
                  bgcolor: isDark ? muiTheme.palette.primary.dark : muiTheme.palette.primary.main,
                  color: '#fff',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  boxShadow: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: isDark ? muiTheme.palette.primary.main : muiTheme.palette.primary.dark,
                  },
                }}
              >
                Sign Out
              </Button>
            </Box>

            <Box
              sx={{
                p: { xs: 2, sm: 4 },
                borderRadius: 2,
                bgcolor: isDark ? muiTheme.palette.error.dark + '22' : muiTheme.palette.error.light + '33',
                border: `1.5px solid ${muiTheme.palette.error.main}`,
                mt: 1,
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ color: muiTheme.palette.error.dark, mb: 1 }}
              >
                Danger Zone
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ color: muiTheme.palette.error.main, mb: 3 }}
              >
                Once you delete your account, there is no going back. Please be certain.
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteAccount}
                sx={{
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  mt: 2,
                  boxShadow: 'none',
                  borderRadius: 2,
                }}
              >
                Delete Account
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Delete Account Confirmation Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          PaperProps={{
            className: isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white'
          }}
        >
          <DialogTitle className={isDark ? 'text-gray-100' : 'text-gray-900'}>
            Delete Account
          </DialogTitle>
          <DialogContent>
            <Typography 
              variant="body1" 
              className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Are you sure you want to delete your account? This action cannot be undone.
            </Typography>
            <Typography 
              variant="body2" 
              className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Please type your email address to confirm:
            </Typography>
            <TextField
              fullWidth
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your email"
              variant="outlined"
              error={!!error}
              helperText={error}
              className={isDark ? 'text-gray-100' : 'text-gray-900'}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseDialog}
              className={isDark ? 'text-gray-300' : 'text-gray-600'}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEmailVerification}
              color="error"
              variant="contained"
              disabled={loading}
            >
              Delete Account
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default SettingsPage;
