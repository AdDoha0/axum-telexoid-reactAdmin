import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976D2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#FF9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
    },
    h2: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: 'Roboto, sans-serif',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});
