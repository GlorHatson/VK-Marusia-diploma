import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { moviesApi } from '../../api/moviesApi';
import type { Movie } from './moviesSlice';

interface SearchState {
  results: Movie[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  results: [],
  loading: false,
  error: null,
};

export const searchMovies = createAsyncThunk(
  'search/searchMovies',
  async (title: string, { rejectWithValue }) => {
    if (!title.trim()) return [];
    try {
      const response = await moviesApi.searchMovies(title, 10);
      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      }
      if (data && typeof data === 'object' && 'name' in data) {
        return rejectWithValue((data as any).name || 'Ошибка сервера');
      }
      return rejectWithValue('Неизвестная ошибка при поиске');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка поиска');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.results = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.results = []; // очищаем при новом запросе
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.error = null;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload as string || 'Ошибка поиска';
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;