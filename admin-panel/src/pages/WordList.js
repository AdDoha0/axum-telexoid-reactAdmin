import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import axios from 'axios';
import { API_URL } from '../config';

const WordList = () => {
  const [words, setWords] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [newWord, setNewWord] = useState({
    term: '',
    definition: '',
    lesson_id: ''
  });

  useEffect(() => {
    fetchWords();
    fetchLessons();
  }, []);

  const fetchWords = async () => {
    try {
      const response = await axios.get(`${API_URL}/words`);
      setWords(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching words:', error);
      setError('Ошибка при загрузке слов');
    }
  };

  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${API_URL}/lessons`);
      setLessons(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching lessons:', error);
      setError('Ошибка при загрузке уроков');
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post(`${API_URL}/words`, newWord);
      setOpen(false);
      setNewWord({
        term: '',
        definition: '',
        lesson_id: ''
      });
      fetchWords();
      setError('');
    } catch (error) {
      console.error('Error creating word:', error);
      setError('Ошибка при создании слова');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/words/${id}`);
      fetchWords();
      setError('');
    } catch (error) {
      console.error('Error deleting word:', error);
      setError('Ошибка при удалении слова');
    }
  };

  return (
    <div>
      {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        style={{ marginBottom: '20px' }}
      >
        Добавить слово
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Термин</TableCell>
              <TableCell>Определение</TableCell>
              <TableCell>Урок</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {words.map((word) => (
              <TableRow key={word.id}>
                <TableCell>{word.id}</TableCell>
                <TableCell>{word.term}</TableCell>
                <TableCell>{word.definition}</TableCell>
                <TableCell>
                  {lessons.find(l => l.id === word.lesson_id)?.title || word.lesson_id}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(word.id)}
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Добавить новое слово</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Термин"
            fullWidth
            value={newWord.term}
            onChange={(e) => setNewWord({ ...newWord, term: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Определение"
            fullWidth
            value={newWord.definition}
            onChange={(e) => setNewWord({ ...newWord, definition: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Урок</InputLabel>
            <Select
              value={newWord.lesson_id}
              onChange={(e) => setNewWord({ ...newWord, lesson_id: e.target.value })}
            >
              {lessons.map((lesson) => (
                <MenuItem key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button onClick={handleCreate} color="primary">
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WordList;
