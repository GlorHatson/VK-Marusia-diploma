import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { moviesApi } from '../../api/moviesApi';

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
  trailerYouTubeId?: string;
  language?: string;
  director?: string | null;
  budget?: number | null;
  revenue?: number | null;
  awardsSummary?: string | null;
  production?: string | null;
}

interface MoviesState {
  top10: Movie[];
  randomMovie: Movie | null;
  currentMovie: Movie | null;
  loading: {
    top10: boolean;
    random: boolean;
    current: boolean;
  };
    error: {
    top10: string | null;
    random: string | null;
    current: string | null;
  };
}

const initialState: MoviesState = {
  top10: [],
  randomMovie: null,
  currentMovie: null,
  loading: {
    top10: false,
    random: false,
    current: false,
  },
  error: { top10: null, random: null, current: null },
};

export const fetchTop10 = createAsyncThunk(
  'movies/fetchTop10',
  async (_, { rejectWithValue }) => {
    try {
      const response = await moviesApi.fetchTop10();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки топ-10');
    }
  }
);

export const fetchRandomMovie = createAsyncThunk(
  'movies/fetchRandomMovie',
  async (_, { rejectWithValue }) => {
    try {
      const response = await moviesApi.fetchRandomMovie();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки случайного фильма');
    }
  }
);

export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await moviesApi.fetchMovieById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки фильма');
    }
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error.current = null;
    },
    clearCurrentMovie: (state) => {
      state.currentMovie = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTop10.pending, (state) => {
        state.loading.top10 = true;
        state.error.top10 = null;
      })
      .addCase(fetchTop10.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.loading.top10 = false;
        state.top10 = action.payload;
      })
      .addCase(fetchTop10.rejected, (state, action) => {
        state.loading.top10 = false;
        state.error.top10 = action.payload as string;
      })
      .addCase(fetchRandomMovie.pending, (state) => {
        state.loading.random = true;
        state.error.random = null;
      })
      .addCase(fetchRandomMovie.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.loading.random = false;
        state.randomMovie = action.payload;
      })
      .addCase(fetchRandomMovie.rejected, (state, action) => {
        state.loading.random = false;
        state.error.random = action.payload as string;
      })
      .addCase(fetchMovieById.pending, (state) => {
        state.loading.current = true;
        state.error.current = null;
        state.currentMovie = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.loading.current = false;
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading.current = false;
        state.error.current = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentMovie } = moviesSlice.actions;
export default moviesSlice.reducer;