import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Movie } from './moviesSlice';
import { moviesApi } from '../../api/moviesApi';

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
      const count = 10;
      const response = await moviesApi.fetchMoviesByGenre(genre, page, count);
      const movies = response.data;
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
        const newMovies = action.payload.movies;
        // Дедупликация на случай дублей от API
        const uniqueNew = newMovies.filter((movie, index, self) =>
          self.findIndex(m => m.id === movie.id) === index
        );
        if (action.payload.page === 1) {
          state.movies = uniqueNew;
        } else {
          const existingIds = new Set(state.movies.map(m => m.id));
          const toAdd = uniqueNew.filter(m => !existingIds.has(m.id));
          state.movies = [...state.movies, ...toAdd];
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