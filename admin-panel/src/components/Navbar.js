import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import {
  Home as HomeIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Translate as TranslateIcon
} from '@mui/icons-material';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const buttonStyle = (path) => ({
    color: 'inherit',
    mx: 1,
    ...(isActive(path) && {
      backgroundColor: 'rgba(255, 255, 255, 0.12)'
    })
  });

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Button
            component={Link}
            to="/"
            color="inherit"
            startIcon={<HomeIcon />}
            sx={buttonStyle('/')}
          >
            Админ-панель
          </Button>
        </Typography>
        <Box>
          <Button
            component={Link}
            to="/textbooks"
            startIcon={<SchoolIcon />}
            sx={buttonStyle('/textbooks')}
          >
            Учебники
          </Button>
          <Button
            component={Link}
            to="/lessons"
            startIcon={<BookIcon />}
            sx={buttonStyle('/lessons')}
          >
            Уроки
          </Button>
          <Button
            component={Link}
            to="/words"
            startIcon={<TranslateIcon />}
            sx={buttonStyle('/words')}
          >
            Слова
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
