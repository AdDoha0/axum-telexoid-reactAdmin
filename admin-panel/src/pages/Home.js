import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Box
} from '@mui/material';
import { 
  School as SchoolIcon,
  Book as BookIcon,
  Translate as TranslateIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const StatCard = ({ title, count, icon, color, onClick }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box sx={{ 
          backgroundColor: `${color}20`,
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {React.cloneElement(icon, { sx: { color: color } })}
        </Box>
        <Typography variant="h4" component="div" color={color}>
          {count}
        </Typography>
      </Box>
      <Typography variant="h6" component="div">
        {title}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" onClick={onClick}>
        Перейти в раздел
      </Button>
    </CardActions>
  </Card>
);

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    textbooks: 0,
    lessons: 0,
    words: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [textbooks, lessons, words] = await Promise.all([
          axios.get(`${API_URL}/textbooks`),
          axios.get(`${API_URL}/lessons`),
          axios.get(`${API_URL}/words`)
        ]);

        setStats({
          textbooks: textbooks.data.length,
          lessons: lessons.data.length,
          words: words.data.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Добро пожаловать в админ-панель
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Управляйте учебными материалами, уроками и словарным запасом в одном месте
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Учебники"
            count={stats.textbooks}
            icon={<SchoolIcon />}
            color="#2196f3"
            onClick={() => navigate('/textbooks')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Уроки"
            count={stats.lessons}
            icon={<BookIcon />}
            color="#4caf50"
            onClick={() => navigate('/lessons')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Слова"
            count={stats.words}
            icon={<TranslateIcon />}
            color="#ff9800"
            onClick={() => navigate('/words')}
          />
        </Grid>
      </Grid>

      <Box mt={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Быстрые действия
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/textbooks')}
              >
                Добавить учебник
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={() => navigate('/lessons')}
              >
                Создать урок
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant="contained" 
                color="success"
                onClick={() => navigate('/words')}
              >
                Добавить слова
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;
