import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../services/axiosInstance';
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
      const response = await apiClient.get('/movie', {
        params: { title: title.trim(), count: 10 },
      });
      return response.data as Movie[];
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
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;