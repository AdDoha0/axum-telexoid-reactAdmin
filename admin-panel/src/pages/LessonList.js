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
  Alert,
  IconButton,
  Tooltip,
  Checkbox,
  TableSortLabel,
  Typography,
  Box,
  Link
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from '../config';
import SearchAndFilter from '../components/SearchAndFilter';

const LessonList = () => {
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [textbooks, setTextbooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [orderBy, setOrderBy] = useState('id');
  const [order, setOrder] = useState('asc');
  const [previewLesson, setPreviewLesson] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    text: '',
    video_url: '',
    textbook_id: ''
  });

  useEffect(() => {
    fetchLessons();
    fetchTextbooks();
  }, []);

  useEffect(() => {
    filterLessons();
  }, [searchText, lessons]);

  const filterLessons = () => {
    const filtered = lessons.filter(lesson => 
      lesson.title.toLowerCase().includes(searchText.toLowerCase()) ||
      lesson.text.toLowerCase().includes(searchText.toLowerCase()) ||
      (lesson.video_url && lesson.video_url.toLowerCase().includes(searchText.toLowerCase())) ||
      textbooks.find(t => t.id === lesson.textbook_id)?.title.toLowerCase().includes(searchText.toLowerCase())
    );
    
    const sorted = sortLessons(filtered);
    setFilteredLessons(sorted);
  };

  const sortLessons = (items) => {
    return [...items].sort((a, b) => {
      const isAsc = order === 'asc';
      if (orderBy === 'id') {
        return isAsc ? a.id - b.id : b.id - a.id;
      }
      if (orderBy === 'textbook') {
        const aTitle = textbooks.find(t => t.id === a.textbook_id)?.title || '';
        const bTitle = textbooks.find(t => t.id === b.textbook_id)?.title || '';
        return isAsc ? aTitle.localeCompare(bTitle) : bTitle.localeCompare(aTitle);
      }
      const aValue = a[orderBy] || '';
      const bValue = b[orderBy] || '';
      return isAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setFilteredLessons(sortLessons(filteredLessons));
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

  const fetchTextbooks = async () => {
    try {
      const response = await axios.get(`${API_URL}/textbooks`);
      setTextbooks(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching textbooks:', error);
      setError('Ошибка при загрузке учебников');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingLesson) {
        await axios.patch(`${API_URL}/lessons/${editingLesson.id}`, formData);
      } else {
        await axios.post(`${API_URL}/lessons`, formData);
      }
      setOpen(false);
      setFormData({
        title: '',
        text: '',
        video_url: '',
        textbook_id: ''
      });
      setEditingLesson(null);
      fetchLessons();
      setError('');
    } catch (error) {
      console.error('Error saving lesson:', error);
      setError('Ошибка при сохранении урока');
    }
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      text: lesson.text,
      video_url: lesson.video_url || '',
      textbook_id: lesson.textbook_id
    });
    setOpen(true);
  };

  const handlePreview = (lesson) => {
    setPreviewLesson(lesson);
    setPreviewOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/lessons/${id}`);
      fetchLessons();
      setError('');
    } catch (error) {
      console.error('Error deleting lesson:', error);
      setError('Ошибка при удалении урока');
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedLessons.map(id => 
        axios.delete(`${API_URL}/lessons/${id}`)
      ));
      setSelectedLessons([]);
      fetchLessons();
      setError('');
    } catch (error) {
      console.error('Error deleting lessons:', error);
      setError('Ошибка при удалении уроков');
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedLessons(filteredLessons.map(l => l.id));
    } else {
      setSelectedLessons([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedLessons(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <div>
      {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
      
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEditingLesson(null);
          setFormData({
            title: '',
            text: '',
            video_url: '',
            textbook_id: ''
          });
          setOpen(true);
        }}
        style={{ marginBottom: '20px' }}
      >
        Добавить урок
      </Button>

      {selectedLessons.length > 0 && (
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteSelected}
          style={{ marginLeft: '10px', marginBottom: '20px' }}
        >
          Удалить выбранные ({selectedLessons.length})
        </Button>
      )}

      <SearchAndFilter
        searchText={searchText}
        onSearchChange={setSearchText}
        placeholder="Поиск по названию, тексту или учебнику..."
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedLessons.length === filteredLessons.length}
                  indeterminate={selectedLessons.length > 0 && selectedLessons.length < filteredLessons.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? order : 'asc'}
                  onClick={() => handleSort('id')}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'title'}
                  direction={orderBy === 'title' ? order : 'asc'}
                  onClick={() => handleSort('title')}
                >
                  Название
                </TableSortLabel>
              </TableCell>
              <TableCell>Текст</TableCell>
              <TableCell>Видео URL</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'textbook'}
                  direction={orderBy === 'textbook' ? order : 'asc'}
                  onClick={() => handleSort('textbook')}
                >
                  Учебник
                </TableSortLabel>
              </TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLessons.map((lesson) => (
              <TableRow key={lesson.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedLessons.includes(lesson.id)}
                    onChange={() => handleSelectOne(lesson.id)}
                  />
                </TableCell>
                <TableCell>{lesson.id}</TableCell>
                <TableCell>{lesson.title}</TableCell>
                <TableCell>{lesson.text.substring(0, 50)}...</TableCell>
                <TableCell>{lesson.video_url}</TableCell>
                <TableCell>
                  {textbooks.find(t => t.id === lesson.textbook_id)?.title || lesson.textbook_id}
                </TableCell>
                <TableCell>
                  <Tooltip title="Просмотр">
                    <IconButton
                      color="info"
                      onClick={() => handlePreview(lesson)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Редактировать">
                    <IconButton 
                      color="primary"
                      onClick={() => handleEdit(lesson)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(lesson.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingLesson ? 'Редактировать урок' : 'Добавить новый урок'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название"
            fullWidth
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Текст урока"
            fullWidth
            multiline
            rows={4}
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Видео URL"
            fullWidth
            value={formData.video_url}
            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Учебник</InputLabel>
            <Select
              value={formData.textbook_id}
              onChange={(e) => setFormData({ ...formData, textbook_id: e.target.value })}
            >
              {textbooks.map((textbook) => (
                <MenuItem key={textbook.id} value={textbook.id}>
                  {textbook.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button onClick={handleSubmit} color="primary">
            {editingLesson ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Просмотр урока: {previewLesson?.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Учебник: {textbooks.find(t => t.id === previewLesson?.textbook_id)?.title}
          </Typography>
          {previewLesson?.video_url && (
            <Box mb={2}>
              <Typography variant="subtitle1" gutterBottom>
                Видео: <Link href={previewLesson.video_url} target="_blank">
                  {previewLesson.video_url}
                </Link>
              </Typography>
            </Box>
          )}
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            {previewLesson?.text}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LessonList;
