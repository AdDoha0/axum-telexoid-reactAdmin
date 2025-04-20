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
  Alert,
  IconButton,
  Tooltip,
  Checkbox,
  TableSortLabel
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from '../config';
import SearchAndFilter from '../components/SearchAndFilter';

const TextbookList = () => {
  const [textbooks, setTextbooks] = useState([]);
  const [filteredTextbooks, setFilteredTextbooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [editingTextbook, setEditingTextbook] = useState(null);
  const [selectedTextbooks, setSelectedTextbooks] = useState([]);
  const [orderBy, setOrderBy] = useState('id');
  const [order, setOrder] = useState('asc');

  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchTextbooks();
  }, []);

  useEffect(() => {
    filterTextbooks();
  }, [searchText, textbooks]);

  const filterTextbooks = () => {
    const filtered = textbooks.filter(textbook => 
      textbook.title.toLowerCase().includes(searchText.toLowerCase()) ||
      (textbook.description && textbook.description.toLowerCase().includes(searchText.toLowerCase()))
    );
    
    const sorted = sortTextbooks(filtered);
    setFilteredTextbooks(sorted);
  };

  const sortTextbooks = (items) => {
    return [...items].sort((a, b) => {
      const isAsc = order === 'asc';
      if (orderBy === 'id') {
        return isAsc ? a.id - b.id : b.id - a.id;
      }
      const aValue = a[orderBy] || '';
      const bValue = b[orderBy] || '';
      return isAsc ? 
        aValue.localeCompare(bValue) : 
        bValue.localeCompare(aValue);
    });
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setFilteredTextbooks(sortTextbooks(filteredTextbooks));
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
      if (editingTextbook) {
        await axios.put(`${API_URL}/textbooks/${editingTextbook.id}`, formData);
      } else {
        await axios.post(`${API_URL}/textbooks`, formData);
      }
      setOpen(false);
      setFormData({ title: '', description: '' });
      setEditingTextbook(null);
      fetchTextbooks();
      setError('');
    } catch (error) {
      console.error('Error saving textbook:', error);
      setError('Ошибка при сохранении учебника');
    }
  };

  const handleEdit = (textbook) => {
    setEditingTextbook(textbook);
    setFormData({
      title: textbook.title,
      description: textbook.description || ''
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/textbooks/${id}`);
      fetchTextbooks();
      setError('');
    } catch (error) {
      console.error('Error deleting textbook:', error);
      setError('Ошибка при удалении учебника');
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedTextbooks.map(id => 
        axios.delete(`${API_URL}/textbooks/${id}`)
      ));
      setSelectedTextbooks([]);
      fetchTextbooks();
      setError('');
    } catch (error) {
      console.error('Error deleting textbooks:', error);
      setError('Ошибка при удалении учебников');
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedTextbooks(filteredTextbooks.map(t => t.id));
    } else {
      setSelectedTextbooks([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedTextbooks(prev => {
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
          setEditingTextbook(null);
          setFormData({ title: '', description: '' });
          setOpen(true);
        }}
        style={{ marginBottom: '20px' }}
      >
        Добавить учебник
      </Button>

      {selectedTextbooks.length > 0 && (
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteSelected}
          style={{ marginLeft: '10px', marginBottom: '20px' }}
        >
          Удалить выбранные ({selectedTextbooks.length})
        </Button>
      )}

      <SearchAndFilter
        searchText={searchText}
        onSearchChange={setSearchText}
        placeholder="Поиск по названию или описанию..."
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedTextbooks.length === filteredTextbooks.length}
                  indeterminate={selectedTextbooks.length > 0 && selectedTextbooks.length < filteredTextbooks.length}
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
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'description'}
                  direction={orderBy === 'description' ? order : 'asc'}
                  onClick={() => handleSort('description')}
                >
                  Описание
                </TableSortLabel>
              </TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTextbooks.map((textbook) => (
              <TableRow key={textbook.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedTextbooks.includes(textbook.id)}
                    onChange={() => handleSelectOne(textbook.id)}
                  />
                </TableCell>
                <TableCell>{textbook.id}</TableCell>
                <TableCell>{textbook.title}</TableCell>
                <TableCell>{textbook.description}</TableCell>
                <TableCell>
                  <Tooltip title="Редактировать">
                    <IconButton 
                      color="primary"
                      onClick={() => handleEdit(textbook)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(textbook.id)}
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

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editingTextbook ? 'Редактировать учебник' : 'Добавить новый учебник'}
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
            label="Описание"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button onClick={handleSubmit} color="primary">
            {editingTextbook ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TextbookList;
