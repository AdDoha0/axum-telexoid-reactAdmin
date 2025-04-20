import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TextbookList from './pages/TextbookList';
import LessonList from './pages/LessonList';
import WordList from './pages/WordList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    success: {
      main: '#4caf50',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div>
          <Navbar />
          <Container style={{ marginTop: '20px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/textbooks" element={<TextbookList />} />
              <Route path="/lessons" element={<LessonList />} />
              <Route path="/words" element={<WordList />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
