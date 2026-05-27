import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../../services/axiosInstance';

export interface Movie {
  id: number;
  title: string;
  originalTitle?: string;
  posterUrl?: string;
  backdropUrl?: string;
  tmdbRating?: number;
  releaseYear?: number;
  genres?: string[];
  plot?: string;
  runtime?: number;
  trailerUrl?: string;
  language?: string;
}

interface MoviesState {
  top10: Movie[];
  randomMovie: Movie | null;
  loading: {
    top10: boolean;
    random: boolean;
  };
  error: string | null;
}

const initialState: MoviesState = {
  top10: [],
  randomMovie: null,
  loading: {
    top10: false,
    random: false,
  },
  error: null,
};

export const fetchTop10 = createAsyncThunk(
  'movies/fetchTop10',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/movie/top10');
      return response.data as Movie[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки топ-10');
    }
  }
);

export const fetchRandomMovie = createAsyncThunk(
  'movies/fetchRandomMovie',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/movie/random');
      return response.data as Movie;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки случайного фильма');
    }
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Топ-10
      .addCase(fetchTop10.pending, (state) => {
        state.loading.top10 = true;
        state.error = null;
      })
      .addCase(fetchTop10.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.loading.top10 = false;
        state.top10 = action.payload;
      })
      .addCase(fetchTop10.rejected, (state, action) => {
        state.loading.top10 = false;
        state.error = action.payload as string;
      })
      // Случайный фильм
      .addCase(fetchRandomMovie.pending, (state) => {
        state.loading.random = true;
        state.error = null;
      })
      .addCase(fetchRandomMovie.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.loading.random = false;
        state.randomMovie = action.payload;
      })
      .addCase(fetchRandomMovie.rejected, (state, action) => {
        state.loading.random = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = moviesSlice.actions;
export default moviesSlice.reducer;