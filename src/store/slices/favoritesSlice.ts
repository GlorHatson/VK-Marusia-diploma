import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { favoritesApi } from '../../api/favoritesApi';
import type {PayloadAction } from '@reduxjs/toolkit';
import type { Movie } from './moviesSlice';

interface FavoritesState {
  items: Movie[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await favoritesApi.getFavorites();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки избранного');
    }
  }
);

// Теперь принимает объект фильма
export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async (movie: Movie, { rejectWithValue }) => {
    try {
      await favoritesApi.addFavorite(movie.id);
      return movie;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка добавления');
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (movieId: number, { rejectWithValue }) => {
    try {
      await favoritesApi.removeFavorite(movieId);
      return movieId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavoriteLocally: (state, action: PayloadAction<Movie>) => {
      if (!state.items.some(m => m.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },
    removeFavoriteLocally: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(m => m.id !== action.payload);
    },
    clearFavorites: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        const movie = action.payload;
        if (!state.items.some(m => m.id === movie.id)) {
          state.items.push(movie);
        }
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.items = state.items.filter(m => m.id !== action.payload);
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { addFavoriteLocally, removeFavoriteLocally, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;