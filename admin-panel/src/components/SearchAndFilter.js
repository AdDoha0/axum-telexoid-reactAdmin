import React from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const SearchAndFilter = ({ 
  searchText, 
  onSearchChange, 
  placeholder = "Поиск...",
  onClear
}) => {
  return (
    <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchText && (
            <InputAdornment position="end">
              <Tooltip title="Очистить">
                <IconButton
                  size="small"
                  onClick={() => {
                    onSearchChange('');
                    if (onClear) onClear();
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          )
        }}
      />
    </Box>
  );
};

export default SearchAndFilter;
