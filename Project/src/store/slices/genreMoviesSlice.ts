import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Movie } from './moviesSlice';
import { apiClient } from '../../services/axiosInstance';

interface GenreMoviesState {
  movies: Movie[];
  genre: string | null;
  page: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: GenreMoviesState = {
  movies: [],
  genre: null,
  page: 1,
  hasMore: true,
  loading: false,
  error: null,
};

export const fetchMoviesByGenre = createAsyncThunk(
  'genreMovies/fetchMoviesByGenre',
  async ({ genre, page }: { genre: string; page: number }, { rejectWithValue }) => {
    try {
      const count = 10; // количество на страницу
      const response = await apiClient.get('/movie', {
        params: { genre, page, count },
      });
      const movies = response.data as Movie[];
      return { movies, page, hasMore: movies.length === count };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки фильмов');
    }
  }
);

const genreMoviesSlice = createSlice({
  name: 'genreMovies',
  initialState,
  reducers: {
    resetGenreMovies: (state) => {
      state.movies = [];
      state.genre = null;
      state.page = 1;
      state.hasMore = true;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoviesByGenre.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoviesByGenre.fulfilled, (state, action) => {
        state.loading = false;
        state.genre = action.meta.arg.genre;
        if (action.payload.page === 1) {
          state.movies = action.payload.movies;
        } else {
          state.movies = [...state.movies, ...action.payload.movies];
        }
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchMoviesByGenre.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetGenreMovies } = genreMoviesSlice.actions;
export default genreMoviesSlice.reducer;